rm -rf ./build/*
gulp build
mkdir ./build/weapp/
cd weapp && npm run build && cd ../
cp -r ./weapp/dist build/weapp/dist
cp -r build/weapp/dist/static ./build
#git add .
#git commit -a -m 'update'
#git push -u origin master
