const express = require("express");
const cors = require("cors");
const db = require("./db");
const { calculateScore } = require("./scoreEngine");

const app = express();
app.use(cors());
app.use(express.json());

/**
 * GET team dashboard
 * Example: /team/Team_1
 */
app.get("/team/:teamName", (req, res) => {
  const teamName = req.params.teamName;

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
    LEFT JOIN activity_signals a ON e.employee_id = a.employee_id
    LEFT JOIN impact_signals i ON e.employee_id = i.employee_id
    WHERE e.team = ?
  `;

  db.query(sql, [teamName], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Database error" });
    }
    const scored = results.map(emp => {
      const scores = calculateScore(emp);
     return {
    ...emp,
    ...scores
  };
});

// 🔥 Rank ONLY inside the team
scored.sort((a, b) => b.impactScore - a.impactScore);

scored.forEach((emp, index) => {
  emp.teamRank = index + 1;
});

res.json(scored);
;
  });
});


app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
