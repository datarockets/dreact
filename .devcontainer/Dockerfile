FROM debian:buster

RUN apt-get update && apt-get -y upgrade

RUN DEBIAN_FRONTEND=noninteractive apt-get install -y \
  curl git sudo locales gnupg zsh \
  apt-transport-https ca-certificates lsb-release

RUN set -eux; \
  dpkg-reconfigure -f noninteractive tzdata; \
  sed -i -e 's/# en_US.UTF-8 UTF-8/en_US.UTF-8 UTF-8/' /etc/locale.gen; \
  echo 'LANG="en_US.UTF-8"' > /etc/default/locale; \
  dpkg-reconfigure --frontend=noninteractive locales; \
  update-locale LANG=en_US.UTF-8

# install docker cli and docker-compose
RUN set -eux; \
  \
  curl -fsSL https://download.docker.com/linux/debian/gpg \
  | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg; \
  \
  echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] \
  https://download.docker.com/linux/debian $(lsb_release -cs) stable" \
  > /etc/apt/sources.list.d/docker.list; \
  \
  apt-get update; \
  apt-get install -y docker-ce-cli; \
  \
  curl -L "https://github.com/docker/compose/releases/download/1.29.1/docker-compose-$(uname -s)-$(uname -m)" \
  -o /usr/local/bin/docker-compose; \
  \
  chmod +x /usr/local/bin/docker-compose; \
  ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose


RUN apt-get -y install \
  # build dependencies for asdf:
  autoconf bison build-essential libssl-dev libyaml-dev libreadline6-dev \
  zlib1g-dev libncurses5-dev libffi-dev libgdbm6 libgdbm-dev libdb-dev \
  libpq-dev \
  # shell:
  rcm


# adding dev user
RUN set -eux; \
  useradd -s /bin/zsh -m dev; \
  echo "dev ALL=(ALL:ALL) NOPASSWD:ALL" > /etc/sudoers.d/dev; \
  mkdir -p /home/dev/.ssh && chown dev:dev /home/dev/.ssh

USER dev
SHELL ["/bin/zsh", "-ic"]

RUN set -eux; \
  git clone https://github.com/datarockets/dotfiles.git ~/.dotfiles; \
  RCRC=$HOME/.dotfiles/rcrc rcup

RUN set -eux; \
  git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.8.0; \
  echo -e ". $HOME/.asdf/asdf.sh" > ~/.zshrc.devcontainer; \
  echo -e "[[ -f ~/.zshrc.devcontainer ]] && source ~/.zshrc.devcontainer" \
  > ~/.zshrc.local; \
  # autocompletions for asdf:
  sudo chmod 775 /usr/local/share/zsh/site-functions; \
  sudo chown root:dev /usr/local/share/zsh/site-functions; \
  ln -s $HOME/.asdf/completions/_asdf /usr/local/share/zsh/site-functions/_asdf


RUN set -eux; \
  asdf plugin-add ruby; \
  asdf install ruby 3.0.1; \
  asdf global ruby 3.0.1

RUN set -eux; \
  asdf plugin-add nodejs; \
  asdf install nodejs 14.16.1; \
  asdf global nodejs 14.16.1

# useful utilites for development:
RUN sudo apt-get -y install vim tmux iputils-ping
