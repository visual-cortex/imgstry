module.exports = {
    ui: 'bdd',
    reporter: 'mochawesome',
    'reporter-option': [
        'reportDir=./reports/unit/',
        'reportTitle=Imgstry',
        'inlineAssets=true',
    ],
    require: [
        'ts-node/register',
        'source-map-support/register',
        'tsconfig-paths/register',
    ],
    recursive: true,
};
