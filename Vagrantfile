# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure("2") do |config|
  # The most common configuration options are documented and commented below.
  # For a complete reference, please see the online documentation at
  # https://docs.vagrantup.com.

  config.vm.box = "ubuntu/trusty64"

  config.vm.network "forwarded_port", guest: 5000, host: 5000

  # Share an additional folder to the guest VM. The first argument is
  # the path on the host to the actual folder. The second argument is
  # the path on the guest to mount the folder. And the optional third
  # argument is a set of non-required options.
  config.vm.synced_folder "../flask-rest-crud", "/flask-rest-crud"


  # Enable provisioning with a shell script. Additional provisioners such as
  # Puppet, Chef, Ansible, Salt, and Docker are also available. Please see the
  # documentation for more information about their specific syntax and use.
  config.vm.provision "shell", inline: <<-SHELL
     apt-get update -y
     apt-get install -y python3 python3-dev python3-pip
	 curl -sL https://deb.nodesource.com/setup_4.x | sudo bash -
	 apt-get install -y nodejs
	 apt-get install -y npm
	 npm install npm@latest -g
   npm install bower -g 
   npm install --global gulp-cli 
  #   apt-get install sqlite3 -y
  #   apt-get install -y apache2
  SHELL

	#config.vm.provision "shell", path: "vagrant-config/virtualenv/project_environment.sh"
	config.vm.provision "shell", path: "vagrant-config/flask/install.sh"

end
