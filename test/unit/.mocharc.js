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
        '~-map-support/register',
        'tsconfig-paths/register',
    ],
    recursive: true,
};
