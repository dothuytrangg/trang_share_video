pipeline {
    agent any
   
   
    stages {
       
        stage('Clone Branch Production'){
            steps  {
              checkout scm
            }
        }
       
        stage('Docker Build and Deploy Production'){
            steps{
                 sh 'docker compose -f docker-compose.prod.yml -p trang_prod_share_video up --build -d --force-recreate '
                 sh 'docker images -f "dangling=true" -q'
            }
        }


        
    }
  
}
