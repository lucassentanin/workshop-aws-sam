rm -rf build
rm -rf node_modules
rm -f ./packaged.yml

mkdir -p build/layers/workshop-aws-sam-commons/nodejs/node_modules

npm install --production
mv node_modules build/layers/workshop-aws-sam-commons/nodejs

mkdir -p build/layers/workshop-aws-sam-commons/nodejs/node_modules/workshop-commons
cp layers/workshop-aws-sam-commons/src/main/* build/layers/workshop-aws-sam-commons/nodejs/node_modules/workshop-commons -r

mkdir -p build/functions/workshop/generate-pdf
cp functions/workshop/generate-pdf/src/main/* build/functions/workshop/generate-pdf/ -r