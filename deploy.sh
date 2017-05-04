rm -rf ./build/*
gulp build
mkdir ./build/weapp/
npm run build
cp -r ./weapp/dist build/weapp/dist
mv build/weapp/dist/static ./build
git add .
git commit -a -m 'update'
git push -u origin master
