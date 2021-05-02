# Food Choices Data Story
## Data Story Component

### Installation
1. Install `idyll` globally by running:

```shell
npm i -g idyll
```
2. Then install dependencies by running:
```shell
npm install
```

### Developing a post locally

To start the project, go to the project root directory and run:
```shell
idyll
```

<!-- ## Building a post for production

Run `idyll build`. The output will appear in the top-level `build` folder. To change the output location, change the `output` option in `package.json`.

## Deploying

Make sure your post has been built, then deploy the docs folder via any static hosting service. -->

### Dependencies

You can install custom dependencies by running:
```shell
npm install <package-name> --save
```

## Data Processor Component

The processor script for our data will be located in the 'processor' directory.
### Installation
Run:

    pip3 install -r processing/requirements.txt


### Execute
Go into 'processing' directory and run:

    python3 main.py

The formatted survey data will appear in the 'data' repository.
