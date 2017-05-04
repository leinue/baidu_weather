rm -rf ./build/*
gulp build
mkdir ./build/weapp/
npm run build
cp -r ./weapp/dist build/weapp/dist
git add .
git commit -a -m 'update'
git push -u origin master
