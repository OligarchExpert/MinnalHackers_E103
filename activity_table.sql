use workforce4;
CREATE TABLE activity_signals (
    activity_id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,

    commits_count INT DEFAULT 0,
    pull_requests_opened INT DEFAULT 0,
    pull_requests_reviewed INT DEFAULT 0,
    code_review_comments INT DEFAULT 0,

    work_items_touched INT DEFAULT 0,
    critical_path_tasks INT DEFAULT 0,
    cross_repo_contributions INT DEFAULT 0,
    docs_or_design_updates INT DEFAULT 0,

    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

INSERT INTO activity_signals (
    employee_id,
    commits_count,
    pull_requests_opened,
    pull_requests_reviewed,
    code_review_comments,
    work_items_touched,
    critical_path_tasks,
    cross_repo_contributions,
    docs_or_design_updates
)
SELECT
    employee_id,
    FLOOR(RAND()*30) + 5,     -- commits
    FLOOR(RAND()*8) + 1,      -- PRs opened
    FLOOR(RAND()*35) + 5,     -- PRs reviewed
    FLOOR(RAND()*80) + 10,    -- review comments
    FLOOR(RAND()*15) + 3,     -- work items
    FLOOR(RAND()*5),          -- critical path tasks
    FLOOR(RAND()*4),          -- cross repo
    FLOOR(RAND()*3)           -- docs/design
FROM employees;

SELECT COUNT(*) AS total_employees FROM activity_signals;

select * from activity_signals;

show tables;

select count(*) from employees;
select count(*) from impact_signals;
select count(*) from activity_signals;

ALTER TABLE activity_signals
DROP COLUMN recorded_at;

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
WHERE e.team = 'Team_1';





DESCRIBE activity_signals;
DESCRIBE impact_signals;
