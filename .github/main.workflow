workflow "Validate" {
  on = "push"
  resolves = ["Lint", "Install Dependencies"]
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
