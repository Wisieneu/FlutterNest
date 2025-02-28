pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Build and Deploy') {
            steps {
                sh 'docker version' 
                sh 'docker compose version' 
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
    post {
        always {
            junit 'test-results/**/*.xml'
        }
    }
}