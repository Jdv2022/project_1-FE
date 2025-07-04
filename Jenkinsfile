pipeline {
    agent any
    
    environment {
        DEPLOY_SERVER = 'jd@212.85.25.94'
        DEPLOY_PATH   = '/var/www/html/sunset/FE'
        SSH_CRED      = '7f5db0fc-1f49-44d1-827b-9f8fbee846ea'
    }

    stages {
		stage('Deploy Production') {
            steps {
                sshagent (credentials: [env.SSH_CRED]) {
                    withCredentials([
                        file(credentialsId: 'FE_ENV', variable: 'FE_ENV'),
                    ]) {
                        // Set permissions
                        sh """
                            ssh -o StrictHostKeyChecking=no jd@212.85.25.94 '
                                sudo chown -R jd:www-data /var/www/html/sunset/FE &&
                                sudo chmod -R 755 /var/www/html/sunset/FE
                            '
                        """
                        
                        // Git pull with prune
                        sh """
                            ssh -o StrictHostKeyChecking=no jd@212.85.25.94 '
                                cd /var/www/html/sunset/FE &&
                                if [ ! -d ".git" ]; then
                                    git clone https://github.com/Jdv2022/project_1-FE . 
                                else
                                    git fetch --prune
                                    git reset --hard origin/main
                                    git clean -fd
                                fi
                            '
                        """
                
                        // Upload .env files
                        sh """
                            scp -o StrictHostKeyChecking=no \$ENV_FILE jd@212.85.25.94:/var/www/html/sunset/FE/src/environments/environment.ts
                        
                            ssh -o StrictHostKeyChecking=no jd@212.85.25.94 '
                                sudo chmod 644 /var/www/html/sunset/FE/src/environments/environment.ts
                            '
                        """
                        
                        sh """
                            ssh -o StrictHostKeyChecking=no jd@212.85.25.94 '
                                cd /var/www/html/sunset/FE &&
                                ng build
                            '
                        """
                    }
                }
            }
        }
    }
}