<?php
namespace Deployer;

require 'provisioning/recipe/mediakron.php';

// Project name
set('application', 'Mediakron');

// Project repository
set('repository', 'git@github.com:MediaKron/mediakron-4.git');

// [Optional] Allocate tty for git clone. Default value is false.
set('git_tty', true); 

// Shared files/dirs between deploys 
add('shared_files', [
    '.env'
]);
add('shared_dirs', [
    'api/storage'
]);

// Writable dirs by web server 
add('writable_dirs', [
    'storage'
]);
set('allow_anonymous_stats', false);

// Hosts

host('ec2-52-90-188-176.compute-1.amazonaws.com')
    ->stage('dev')
    ->user('ubuntu')
    ->set('branch', 'master')
    ->set('deploy_path', '/var/www/mediakron');


// [Optional] if deploy fails automatically unlock.
after('deploy:failed', 'deploy:unlock');

// [Optional] if deploy fails automatically unlock.
after('deploy:failed', 'deploy:unlock');

// Migrate database before symlink new release.
//before('deploy:symlink', 'artisan:migrate');

task('artisan:opcache:clear', function () {
    run('{{bin/php}} {{release_path}}/src/artisan opcache:clear');
    run('{{bin/php}} {{release_path}}/src/artisan opcache:optimize');
});

task('artisan:config:clear', function () {
    run('{{bin/php}} {{release_path}}/src/artisan config:clear');
    run('{{bin/php}} {{release_path}}/src/artisan config:cache');
});

task('restart:supervisor', function () {
    run('sudo service supervisord restart', ['timeout' => null, 'tty' => true]);
});

task('vue:build', function () {
    run('cd {{release_path}} && npm install && npm run mediakron:build:dev');
});

before('deploy:symlink', 'artisan:config:clear');
before('deploy:symlink', 'vue:build');
after('deploy:symlink', 'artisan:opcache:clear');
after('deploy:symlink', 'restart:supervisor');


