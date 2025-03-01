pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('verify tooling') {
            steps {
                sh '''
                docker version 
                docker info 
                docker-compose version
                curl --version
                '''
            }
        }

        stage('Prune Docker data') {
            steps {
                sh 'docker system prune -a --volumes -f'
            }
        }

        stage('Copy .env files') {
            steps {
                sh 'cp /var/jenkins_secrets/flutternest/backend.env ${WORKSPACE}/backend/.env'
                sh 'cp /var/jenkins_secrets/flutternest/frontend.env ${WORKSPACE}/frontend/.env'
                sh 'cp /var/jenkins_secrets/flutternest/test-app.env ${WORKSPACE}/test-app/.env'
            }
        }

        stage('Build and Deploy') {
            steps {
                sh 'docker-compose build'
                sh 'docker-compose up -d'
            }
        }
        // stage('Test') {
        //     steps {
        //         sh 'docker-compose run app pnpm test'
        //     }
        // }
    }
    // post {
        // always {
            // junit 'test-results/**/*.xml'
        // }
    // }
}