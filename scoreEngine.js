const express = require("express");
const router = express.Router();
const db = require("./db");

// GET employees by team
router.get("/:team", async (req, res) => {
  const recognizesTeam = req.params.team;

  const sql = `
    SELECT 
      e.employee_id,
      e.name,
      e.team,

      a.commits_count,
      a.pull_requests_opened,
      a.pull_requests_reviewed,
      a.code_review_comments,
      a.work_items_touched,
      a.critical_path_tasks,
      a.cross_repo_contributions,
      a.docs_or_design_updates,

      i.bugs_fixed,
      i.critical_bugs_fixed,
      i.features_delivered,
      i.incidents_prevented,
      i.performance_improvements,
      i.refactors_completed,
      i.mentoring_sessions,
      i.reviews_accepted

    FROM employees e
    LEFT JOIN activity_signals a 
      ON e.employee_id = a.employee_id
    LEFT JOIN impact_signals i
      ON e.employee_id = i.employee_id
    WHERE e.team = ?
  `;

  try {
    const [rows] = await db.execute(sql, [recognizesTeam]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;

function calculateScore(employee) {
  // -------- Activity (visibility) --------
  const activityScore =
    (employee.commits_count || 0) * 1 +
    (employee.pull_requests_opened || 0) * 2 +
    (employee.pull_requests_reviewed || 0) * 1.5 +
    (employee.code_review_comments || 0) * 0.5 +
    (employee.work_items_touched || 0) * 2 +
    (employee.docs_or_design_updates || 0) * 1;

  // -------- Impact (real value) --------
  const impactScore =
    (employee.bugs_fixed || 0) * 2 +
    (employee.critical_bugs_fixed || 0) * 6 +
    (employee.features_delivered || 0) * 5 +
    (employee.incidents_prevented || 0) * 6 +
    (employee.performance_improvements || 0) * 4 +
    (employee.refactors_completed || 0) * 3 +
    (employee.mentoring_sessions || 0) * 3 +
    (employee.critical_path_tasks || 0) * 7;

  // -------- Visibility Gap --------
  const visibilityGap = impactScore - activityScore;

  // -------- Silent Architect --------
  const silentArchitect =
    impactScore >= 40 && activityScore <= 25;

  return {
    activityScore: Number(activityScore.toFixed(2)),
    impactScore: Number(impactScore.toFixed(2)),
    visibilityGap: Number(visibilityGap.toFixed(2)),
    silentArchitect
  };
}

module.exports = { calculateScore };
