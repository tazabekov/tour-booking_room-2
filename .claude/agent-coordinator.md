# Agent Coordinator - Orchestration System

## Purpose
This file defines how the main Claude instance coordinates and orchestrates subagents to accomplish complex tasks efficiently.

## Core Principles

1. **Single Source of Truth**: Main Claude reads this file to understand orchestration rules
2. **Parallel Execution**: Independent tasks should run in parallel when possible
3. **Context Preservation**: Always pass relevant context between agents
4. **Clear Handoffs**: Each agent completes their scope before handing off
5. **Fail Fast**: Report blockers immediately, don't wait

## Agent Selection Logic

### When to Use Which Agent

```
USER REQUEST → ANALYZE → SELECT AGENT(S) → EXECUTE → COORDINATE RESULTS
```

#### Frontend Developer
**Trigger Keywords**: UI, component, React, frontend, styling, TypeScript (frontend), responsive, accessibility
**Use When**:
- Building/modifying React components
- Styling with Tailwind/CSS
- Frontend state management
- Client-side routing
- Form handling
**Examples**:
- "Create a login form"
- "Add dark mode toggle"
- "Fix responsive layout issues"

#### Backend Developer
**Trigger Keywords**: API, endpoint, database, server, FastAPI, PostgreSQL, authentication, migration
**Use When**:
- Creating/modifying API endpoints
- Database schema changes
- Server-side logic
- Authentication/authorization
- Data validation
**Examples**:
- "Create user registration endpoint"
- "Add database migration for posts table"
- "Implement JWT authentication"

#### DevOps Engineer
**Trigger Keywords**: deploy, Docker, CI/CD, production, infrastructure, monitoring, environment
**Use When**:
- Setting up deployment pipelines
- Containerization
- Infrastructure configuration
- Production monitoring
- Environment setup
**Examples**:
- "Set up CI/CD pipeline"
- "Create Dockerfile for the application"
- "Configure production deployment"

#### Code Reviewer
**Trigger Pattern**: AUTOMATIC after significant code changes
**Use When**:
- After implementing new features
- Before committing major changes
- When security concerns exist
- After refactoring
**Auto-trigger**: Run proactively after main agents complete work

#### Test Engineer
**Trigger Keywords**: test, coverage, quality, CI/CD testing
**Use When**:
- Setting up test infrastructure
- Writing test suites
- Analyzing test coverage
- Performance testing
**Examples**:
- "Set up testing framework"
- "Add tests for authentication"
- "Run performance tests"

#### UI/UX Designer
**Trigger Keywords**: design system, user flow, wireframe, UX, accessibility audit
**Use When**:
- Planning new features (before development)
- Creating design systems
- User flow optimization
- Accessibility improvements
**Examples**:
- "Design user onboarding flow"
- "Create design system guidelines"
- "Audit accessibility"

## Workflow Patterns

### Pattern 1: Full-Stack Feature
**Scenario**: User requests a complete feature (e.g., "Add comment system")

```
SEQUENCE:
1. UI/UX Designer (optional, if complex UX) → Design flows and wireframes
2. Backend Developer → Create API endpoints and database schema
3. Frontend Developer → Build UI components and integration
4. Test Engineer → Add comprehensive tests
5. Code Reviewer → Review all changes
6. DevOps Engineer (if production) → Update deployment configs
```

**Main Claude Role**:
- Coordinate sequence
- Pass context between agents
- Aggregate results
- Report to user

### Pattern 2: Bug Fix
**Scenario**: User reports a bug

```
PARALLEL/SEQUENCE:
1. Main Claude → Analyze and locate bug
2. IF frontend bug → Frontend Developer
   ELSE IF backend bug → Backend Developer
   ELSE IF infra bug → DevOps Engineer
3. Test Engineer → Add regression test
4. Code Reviewer → Verify fix
```

### Pattern 3: Refactoring
**Scenario**: Code improvement without feature changes

```
SEQUENCE:
1. Main Claude → Identify scope
2. Appropriate Developer Agent → Perform refactoring
3. Test Engineer → Verify existing tests pass
4. Code Reviewer → Ensure quality improved
```

### Pattern 4: Production Deployment
**Scenario**: Deploy to production

```
SEQUENCE:
1. Code Reviewer → Final review of all changes
2. Test Engineer → Run full test suite
3. DevOps Engineer → Execute deployment
4. DevOps Engineer → Post-deploy verification
```

### Pattern 5: New Project Setup
**Scenario**: Initialize new project

```
PARALLEL then SEQUENCE:
PARALLEL:
- Backend Developer → Set up backend structure
- Frontend Developer → Set up frontend structure

SEQUENCE:
- Test Engineer → Set up testing infrastructure
- DevOps Engineer → Set up CI/CD and deployment
- Main Claude → Create project documentation
```

## Context Passing Protocol

### Required Context Structure
When invoking an agent, ALWAYS include:

```markdown
## Task Context
**Feature/Task**: [Name of the feature or task]
**Type**: [feature|bugfix|refactor|setup]
**Priority**: [high|medium|low]
**Dependencies**: [List of dependencies or prerequisite agents]

## Technical Context
**Affected Areas**: [frontend|backend|infrastructure]
**Related Files**: [List of relevant files]
**Existing Patterns**: [Link to or describe existing patterns to follow]

## User Requirements
[Original user request or requirements]

## Previous Agent Output
[If applicable, output from previous agent in workflow]

## Expected Deliverables
[What this agent should produce]

## Constraints
[Any limitations or requirements to consider]
```

### Context File Usage
- **Read** `task-context.md` before invoking any agent
- **Update** `task-context.md` after each agent completes
- **Update** `task_queue.md` to track progress

## Coordination Rules

### Rule 1: Parallel Execution
When tasks are independent, launch agents in parallel:
```
✅ Backend API + Frontend UI (parallel - different codebases)
✅ Multiple independent bug fixes (parallel)
❌ Backend API then Frontend integration (sequential - dependency)
```

### Rule 2: Context Preservation
- Always read current context before agent invocation
- Update context after agent completion
- Pass relevant outputs to next agent

### Rule 3: Proactive Quality Checks
After main implementation agents (frontend/backend):
- ALWAYS run Code Reviewer
- CONSIDER Test Engineer if tests exist or are required

### Rule 4: Escalation
If any agent reports:
- **Blocker**: Pause workflow, ask user for clarification
- **Architectural Decision**: Escalate to main Claude and user
- **Security Concern**: Immediate escalation to Code Reviewer and user

### Rule 5: Progress Reporting
- Update `task_queue.md` after each agent completes
- Report progress to user at major milestones
- Don't wait until all agents finish to report

## Decision Matrix

### Should I Use an Agent?

| Situation | Action |
|-----------|--------|
| Single file edit, clear solution | Main Claude handles directly |
| Feature touching multiple files/systems | Use appropriate specialist agent(s) |
| Need expertise (security, performance) | Use specialist agent |
| Routine task, well-defined pattern | Main Claude can handle or delegate based on complexity |
| User explicitly mentions deployment/testing | Use DevOps/Test Engineer |

### How Many Agents?

| Complexity | Approach |
|------------|----------|
| Simple (1-2 files) | Main Claude or 1 specialist |
| Medium (3-5 files, single domain) | 1-2 specialists + Code Reviewer |
| Complex (multiple domains) | Full workflow with 3+ specialists |
| Production-critical | Full workflow + ALL quality checks |

## Error Handling

### Agent Failure Scenarios

1. **Agent Cannot Complete Task**
   - Agent reports blocker with details
   - Main Claude evaluates alternatives
   - Escalate to user if needed

2. **Agent Produces Incorrect Solution**
   - Code Reviewer catches issues
   - Return to original agent with feedback
   - Maximum 2 retry attempts

3. **Dependency Not Met**
   - Check workflow sequence
   - Run prerequisite agent first
   - Update workflow if pattern wrong

4. **Conflicting Changes**
   - Main Claude resolves conflicts
   - Consult agents if needed
   - User decision for architectural conflicts

## Quality Gates

### Before Committing Code
✅ Code Reviewer has reviewed
✅ Tests exist and pass (or Test Engineer consulted)
✅ No security vulnerabilities flagged
✅ Follows existing code patterns

### Before Production Deployment
✅ All quality gates above
✅ DevOps Engineer has verified config
✅ Rollback plan documented
✅ Monitoring/alerting configured

## Agent Communication Protocol

### Invoking an Agent
Main Claude should:
1. Prepare context using Context Passing Protocol
2. Clearly state the task and expected output
3. Set model (haiku for simple, sonnet for complex)
4. Decide: blocking vs background execution

### Agent Completion
Agent should respond with:
```markdown
## Completed Tasks
- [List of completed items]

## Changes Made
- [File]: [Description of changes]

## Decisions Made
- [Decision]: [Rationale]

## Blockers/Issues
- [None or list issues]

## Next Steps
- [Recommendations for next agent or user]
```

### Main Claude Response to User
After agents complete:
```markdown
## Summary
[High-level summary of what was accomplished]

## Changes
[Key files modified with brief descriptions]

## Quality Checks
✅ Code reviewed
✅ Tests added/passing
[etc]

## Next Steps
[What user should do next, if anything]
```

## Optimization Guidelines

### When to NOT Use Agents
- Reading a single file
- Simple grep/glob searches
- Answering questions about code
- Making trivial edits (<5 lines)
- User just wants information

### When to Use Agents
- Implementing features (>1 file)
- Architectural changes
- Need deep expertise (security, performance, design)
- User explicitly requests specific work (deployment, tests)
- Production-critical changes

## Monitoring and Improvement

Main Claude should track:
- Agent success rates
- Workflow bottlenecks
- Common escalation patterns

Periodically review and update:
- Workflow patterns
- Context passing efficiency
- Agent specialization boundaries

---

**Version**: 1.0
**Last Updated**: 2025-12-12
**Owner**: Main Claude Instance
