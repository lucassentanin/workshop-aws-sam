# Lista de ambientes válidos
declare -a envoriments=("local" "dev" "hml" "prd")

function validateEnvironmentArg() {
    for val in "${envoriments[@]}"; do
        if [ "$val" == "$1" ]; then
            true; return
        fi
    done
    false
}

echo -e "\n----- INICIO DA EXECUÇÃO DO SCRIPT ----- \n"

if validateEnvironmentArg $1; then
    echo "Ambiente de implantação: $1"
else
    echo -e "ERRO: "
    echo -e "\n   Parâmetro 'Ambiente de implantação inválido'."
    echo -e "\n\nSintax: ./deploy <AMBIENTE> [AWS_PROFLE [APP_SUFIXO]]"
    echo -e "\n   AMBIENTE   : Ambiente de implantação. Valores válidos: [" $(IFS=' '  ; echo "${envoriments[*]}") "]"
    echo -e "\n   AWS_PROFLE : Profile configurado no arquivo ~/.aws/credentials "
    echo -e "\n   APP_SUFIXO : Sufixo que será utilizado na aplicação"
    echo -e "\n\n----- FIM DA EXECUÇÃO DO SCRIPT ----- \n"
    exit 1
fi


ENV=$1
AWS_PROFILE=$2
APP_SUFIXO=$3

APP_NAME=''

if [ -z "$APP_SUFIXO" ]; then
    APP_NAME="${ENV}-workshop-aws-sam"
else
    APP_NAME="${ENV}-workshop-aws-sam-${APP_SUFIXO}"
fi

echo "Nome da aplicação: $APP_NAME"

PARAMETERS=""
PARAMETERS+=" "

echo "$PARAMETERS"

./sc-build.sh

if [ -f "template.yml" ]; then
    echo "Iniciando empacotamento...."
    sam package \
        --template-file template.yml \
        --output-template-file packaged.yml \
        --s3-bucket "$APP_NAME" \
        --region us-east-1 \
        --profile "$AWS_PROFILE"
fi

if [ -f "packaged.yml" ]; then
    echo "Iniciando implantação...."
    sam deploy \
        --template-file packaged.yml \
        --stack-name "$APP_NAME" \
        --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM \
        --region us-east-1 \
        --tags app-name="$APP_NAME" environment="${ENV}" \
        --profile "$AWS_PROFILE" \
        --parameter-overrides \
            EnvironmentParam="${ENV}" \
            FunctionsLabelParam=active \
        --s3-bucket cloudformation-stacks-sam
fi

echo -e "\n----- FIM DA EXECUÇÃO DO SCRIPT ----- \n"
