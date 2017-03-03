/**
 All blocks and related property modules loaded by require.js
 **/
export const BLOCKS_LOADED = 'BLOCKS_LOADED';

/**
 block.PLACEMENT_SCENE indicates the insertion is inside a Scene
 */
export const PLACEMENT_SCENE = 'PLACEMENT_SCENE';

/**
 block.PLACEMENT_CHANNEL indicates the insertion is on the timeline_channel
 */
export const PLACEMENT_CHANNEL = 'PLACEMENT_CHANNEL';

/**
 block.PLACEMENT_IS_SCENE indicates the insertion is itself a Scene
 */
export const PLACEMENT_IS_SCENE = 'PLACEMENT_IS_SCENE';

/**
 block.PLACEMENT_LISTS indicates the insertion is inside a collection list such
 as the Collection Block or the Location based block. This event is used for example
 when building the list of available blocks in AddBlockView
 */
export const PLACEMENT_LISTS = 'PLACEMENT_LISTS';



export const BlockLabels = {
    'BLOCKCODE_SCENE': 3510,
    'BLOCKCODE_COLLECTION': 4100,
    'BLOCKCODE_TWITTER': 4500,
    'BLOCKCODE_TWITTER_ITEM': 4505,
    'BLOCKCODE_JSON': 4300,
    'BLOCKCODE_JSON_ITEM': 4310,
    'BLOCKCODE_WORLD_WEATHER': 6010,
    'BLOCKCODE_GOOGLE_SHEETS': 6022,
    'BLOCKCODE_CALENDAR': 6020,
    'BLOCKCODE_TWITTERV3': 6230,
    'BLOCKCODE_INSTAGRAM': 6050,
    'BLOCKCODE_DIGG': 6000,
    'BLOCKCODE_IMAGE': 3130,
    'BLOCKCODE_SVG': 3140,
    'BLOCKCODE_VIDEO': 3100,
    'RSS': 3345,
    'QR': 3430,
    'YOUTUBE': 4600,
    'LOCATION': 4105,
    'FASTERQ': 6100,
    'IMAGE': 3160,
    'EXTERNAL_VIDEO': 3150,
    'CLOCK': 3320,
    'HTML': 3235,
    'LABEL': 3241,
    'MRSS': 3340
}