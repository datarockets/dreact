workflow "Validate" {
  on = "push"
  resolves = ["Install Dependencies", "Lint", "Test"]
}

action "Install Dependencies" {
  uses = "actions/npm@master"
  args = "install"
}

action "Lint" {
  uses = "actions/npm@master"
  needs = ["Install Dependencies"]
  args = "run lint"
}

action "Test" {
  uses = "actions/npm@master"
  needs = ["Install Dependencies"]
  args = "run test"
}
