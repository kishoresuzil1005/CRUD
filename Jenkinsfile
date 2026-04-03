pipeline {
    agent any

    tools {
        nodejs 'Node18'
    }

    environment {
        VERCEL_TOKEN = credentials('vercel-token')
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
                sh 'git fetch --tags'
            }
        }

        stage('Detect Tag') {
            steps {
                script {
                    env.TAG_NAME = sh(
                        script: "git describe --tags --exact-match || echo ''",
                        returnStdout: true
                    ).trim()

                    if (!env.TAG_NAME) {
                        error("❌ No tag found")
                    }
                }
            }
        }

        stage('Install') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy') {
            steps {
                script {
                    if (env.TAG_NAME.startsWith("v")) {
                        sh """
                        vercel deploy --prod \
                        --token=$VERCEL_TOKEN \
                        --confirm
                        """
                    } else {
                        sh """
                        vercel deploy \
                        --token=$VERCEL_TOKEN \
                        --confirm
                        """
                    }
                }
            }
        }
    }
}
