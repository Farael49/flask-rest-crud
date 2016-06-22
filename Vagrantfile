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

  config.vm.box = "hashicorp/precise64"

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
     apt-get install python-pip -y
  #   apt-get install -y apache2
  SHELL

	config.vm.provision "shell", path: "vagrant-config/virtualenv/project_environment.sh"
	config.vm.provision "shell", path: "vagrant-config/flask/install.sh"

end
