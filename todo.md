# Bugs:
## Priority 1:
- [ ] Change scrollbar in chrome to look like that in firefox
- [ ] Make responsive
- [ ] automatically add user in team members when they create a project.
- [ ] phase completion circle does not work
- [ ] Notification and Theme toggle switches places on project page and phase page.

## Priority 2
- [ ] project search bar only works with minimum 3 chars it should work with one too
- [ ] task assignment notification is sent two times
- [ ] Fix console errors in kanban
- [ ] Add postioning logic in kanban

# Features: 
- [ ] show pending invitations on teams page
- [ ] In tech stack use predefined items instead of letting users add random shit

# Miscellaneous:
- [ ] What if someone assigns me a task and instead of doing it I assign it back to them?
- [ ] whenever a task is assigned no matter from which part of the ui , notification logic should run from a central location.
- [ ] invitationHandled is not working as expected
- [ ] AddMemberModal closes immediately on button click, it should close after action is completed
- [ ] fix notification sending logic

# Done:
- [x] Add Profile Icon at the bottom of sidebar
- [x] why is the theme always dark on auth pages
- [x] improve phase creation loading
- [x] fix the type error in ProjectCard.tsx
- [x] Refactor create-project form to use react-hook-form
- [x] Add option for searching and filtering projects
- [x] CurrentPhase should be in project model not Phase
- [x] Task model does not have completed field
- [x] Tasks should have statuses
- [x] Add due date to tasks model
- [x] Add due date and last updated to task table
- [x] Fix schema isn't registered error
- [x] User should be able to set CurrentPhase
- [x] Add timestamps to models?
- [x] Add colors to statuses, priorities and phases?
- [x] Add create task button in both tables and kanban board
- [x] Task form validation shows errors inconsistently
- [x] set current phase otimistically
- [x] fix width of phase cards
- [x] go through code phase.actions.ts
- [x] should router.refresh() be added
- [x] handle indexing of phases
- [x] handle phase number before title
- [x] In Create project form every phase requires atleast one task (make tasks optional)
- [x] fix styling of kanban board cards
- [x] Styling
- [x] Ai generate button
- [x] Pass teamMembers to PhaseTaskForm
- [x] Go through FacultySelector and TeamMembers selector
- [x] what to show when user clicks on invite?
- [x] Make password input in auth pages of type password
- [x] Instead of regex check let user choose whether they are student or faculty on auth pages
- [x] fix role in auth
- [x] deploy
- [x] readme
- [x] login user automatically after they sign up
- [x] user profile not loading on first load.
- [x] fix gemini api error
- [x] add loading indicator for server pages
