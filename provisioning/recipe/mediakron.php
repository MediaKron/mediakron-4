<?php
/* (c) Anton Medvedev <anton@medv.io>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 * 
 * Modified for mediakron deployment by Brad Mering
 */
/*
 * This recipe supports Laravel 5.1+, for older versions, please read the documentation https://github.com/deployphp/docs
 */
namespace Deployer;
require_once __DIR__ . '/common.php';
// Laravel shared dirs
set('shared_dirs', [
    'storage',
]);
// Laravel shared file
set('shared_files', [
    '.env',
]);
// Laravel writable dirs
set('writable_dirs', [
    'bootstrap/cache',
    'storage',
    'storage/app',
    'storage/app/public',
    'storage/framework',
    'storage/framework/cache',
    'storage/framework/sessions',
    'storage/framework/views',
    'storage/logs',
]);
set('laravel_version', function () {
    $result = run('cd {{release_path}} && {{bin/php}} api/artisan --version');
    preg_match_all('/(\d+\.?)+/', $result, $matches);
    $version = $matches[0][0] ?? 5.5;
    return $version;
});
/**
 * Helper tasks
 */
desc('Disable maintenance mode');
task('artisan:up', function () {
    $output = run('if [ -f {{deploy_path}}/current/artisan ]; then {{bin/php}} {{deploy_path}}/current/api/artisan up; fi');
    writeln('<info>' . $output . '</info>');
});
desc('Enable maintenance mode');
task('artisan:down', function () {
    $output = run('if [ -f {{deploy_path}}/current/artisan ]; then {{bin/php}} {{deploy_path}}/current/api/artisan down; fi');
    writeln('<info>' . $output . '</info>');
});
desc('Execute artisan migrate');
task('artisan:migrate', function () {
    run('{{bin/php}} {{release_path}}/api/artisan migrate --force');
})->once();
desc('Execute artisan migrate:fresh');
task('artisan:migrate:fresh', function () {
    run('{{bin/php}} {{release_path}}/api/artisan migrate:fresh --force');
});
desc('Execute artisan migrate:rollback');
task('artisan:migrate:rollback', function () {
    $output = run('{{bin/php}} {{release_path}}/api/artisan migrate:rollback --force');
    writeln('<info>' . $output . '</info>');
});
desc('Execute artisan migrate:status');
task('artisan:migrate:status', function () {
    $output = run('{{bin/php}} {{release_path}}/api/artisan migrate:status');
    writeln('<info>' . $output . '</info>');
});
desc('Execute artisan db:seed');
task('artisan:db:seed', function () {
    $output = run('{{bin/php}} {{release_path}}/api/artisan db:seed --force');
    writeln('<info>' . $output . '</info>');
});
desc('Execute artisan cache:clear');
task('artisan:cache:clear', function () {
    run('{{bin/php}} {{release_path}}/api/artisan cache:clear');
});
desc('Execute artisan config:cache');
task('artisan:config:cache', function () {
    run('{{bin/php}} {{release_path}}/api/artisan config:cache');
});
desc('Execute artisan route:cache');
task('artisan:route:cache', function () {
    run('{{bin/php}} {{release_path}}/api/artisan route:cache');
});
desc('Execute artisan view:clear');
task('artisan:view:clear', function () {
    run('{{bin/php}} {{release_path}}/api/artisan view:clear');
});
desc('Execute artisan optimize');
task('artisan:optimize', function () {
    $deprecatedVersion = 5.5;
    $currentVersion = get('laravel_version');
    if (version_compare($currentVersion, $deprecatedVersion, '<')) {
        run('{{bin/php}} {{release_path}}/api/artisan optimize');
    }
});
desc('Execute artisan queue:restart');
task('artisan:queue:restart', function () {
    run('{{bin/php}} {{release_path}}/api/artisan queue:restart');
});
desc('Execute artisan horizon:terminate');
task('artisan:horizon:terminate', function () {
    run('{{bin/php}} {{release_path}}/api/artisan horizon:terminate');
});
desc('Execute artisan storage:link');
task('artisan:storage:link', function () {
    $needsVersion = 5.3;
    $currentVersion = get('laravel_version');
    if (version_compare($currentVersion, $needsVersion, '>=')) {
        run('{{bin/php}} {{release_path}}/api/artisan storage:link');
    }
});
/**
 * Task deploy:public_disk support the public disk.
 * To run this task automatically, please add below line to your deploy.php file
 *
 *     before('deploy:symlink', 'deploy:public_disk');
 *
 * @see https://laravel.com/docs/5.2/filesystem#configuration
 */
desc('Make symlink for public disk');
task('deploy:public_disk', function () {
    // Remove from source.
    run('if [ -d $(echo {{release_path}}/public/storage) ]; then rm -rf {{release_path}}/public/storage; fi');
    // Create shared dir if it does not exist.
    run('mkdir -p {{deploy_path}}/shared/storage/app/public');
    // Symlink shared dir to release dir
    run('{{bin/symlink}} {{deploy_path}}/shared/storage/app/public {{release_path}}/public/storage');
});
/**
 * Main task
 */
desc('Deploy your project');
task('deploy', [
    'deploy:info',
    'deploy:prepare',
    'deploy:lock',
    'deploy:release',
    'deploy:update_code',
    'deploy:shared',
    'deploy:vendors',
    'deploy:writable',
    'artisan:storage:link',
    'artisan:view:clear',
    'artisan:config:cache',
    'artisan:optimize',
    'deploy:symlink',
    'deploy:unlock',
    'cleanup',
]);
after('deploy', 'success');