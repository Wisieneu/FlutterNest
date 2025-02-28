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

        stage('Build and Deploy') {
            steps {
                sh '''docker version 
                docker-compose version
                docker-compose build
                docker-compose up -d
                '''
            }
        }
        // stage('Test') {
        //     steps {
        //         sh 'docker-compose run app pnpm test'
        //     }
        // }
    }
    post {
        always {
            sh 'docker-compose down --remove-orphans -v'
            sh 'docker-compose ps'
            // junit 'test-results/**/*.xml'
        }
    }
}