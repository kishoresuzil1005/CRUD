pipeline {
    agent any

    environment {
        // GitHub Configuration
        GITHUB_REPO = "https://github.com/kishoresuzil1005/CRUD.git"
        GITHUB_BRANCH = "dev"

        // Vercel Configuration
        VERCEL_TOKEN = credentials('vercel-token')
        VERCEL_ORG_ID = credentials('vercel-org-id')
        VERCEL_PROJECT_ID_STAGE = credentials('vercel-project-stage')
        VERCEL_PROJECT_ID_LIVE = credentials('vercel-project-live')
    }

    stages {

        stage('Checkout Code') {
            steps {
                echo "========== STAGE: Checking out main branch =========="

                git branch: "${GITHUB_BRANCH}",
                    url: "${GITHUB_REPO}",
                    credentialsId: 'github-access-token'
            }
        }

        stage('Install Dependencies') {
            steps {
                echo "========== STAGE: Installing Dependencies =========="
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                echo "========== STAGE: Running Tests =========="
                sh 'npm run test || true'
            }
        }

        stage('Build Project') {
            steps {
                echo "========== STAGE: Building Project =========="
                sh 'npm run build'
            }
        }

        stage('Select Environment') {
            steps {
                script {
                    echo "========== STAGE: Selecting Deployment Environment =========="

                    def choice = input(
                        message: 'Deploy to which environment?',
                        ok: 'Deploy',
                        parameters: [
                            choice(
                                name: 'ENVIRONMENT',
                                choices: ['skip', 'stage', 'live'],
                                description: 'Select target environment'
                            )
                        ]
                    )

                    env.DEPLOY_ENV = choice

                    if (choice == 'stage') {
                        env.VERCEL_PROJECT_ID = VERCEL_PROJECT_ID_STAGE
                        echo "→ Deploying to STAGE"
                    } else if (choice == 'live') {
                        env.VERCEL_PROJECT_ID = VERCEL_PROJECT_ID_LIVE
                        echo "→ Deploying to LIVE"
                    } else {
                        echo "→ Skipping deployment"
                    }
                }
            }
        }

        stage('Deploy to Vercel') {
            when {
                expression { env.DEPLOY_ENV != 'skip' }
            }
            steps {
                echo "========== STAGE: Deploying to Vercel =========="

                sh '''
                npm install -g vercel

                vercel deploy \
                  --token $VERCEL_TOKEN \
                  --yes \
                  --prod
                '''
            }
        }

        stage('Finish') {
            steps {
                echo "========== PIPELINE FINISHED =========="
                echo "Deployment Environment: ${DEPLOY_ENV}"
            }
        }
    }

    post {
        success {
            echo "✅ SUCCESS: Pipeline completed"
        }
        failure {
            echo "❌ FAILED: Check logs"
        }
    }
}
