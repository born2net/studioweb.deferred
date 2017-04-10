import {Injectable} from "@angular/core";


@Injectable()
export class WizardService {

    private m_enjoyHint: EnjoyHint;

    private wizardSteps = [

        {
            "click #newCampaign": 'a quick 5 minute tutorial</text><br/>and we will teach you how to use StudioLite... its easy.',
            "skipButton": {text: "quit"},
            left: 10,
            right: 10,
            top: 6,
            bottom: 6,
            onBeforeStart: function () {
                log('STEP 1');
            }
        },
        {
            "key #newCampaignName": 'name your campaign, press [ENTER] when done</text><br/>this will become useful later<br/>when you assign your campaign to a remote screen<br/>(a screen is also referred to as a <u>station</u>)',
            "skipButton": {text: "quit"},
            keyCode: 13,
            onBeforeStart: function () {
                log('STEP 2');
            }
        },
        {
            event: "click",
            selector: $('#orientationView').find('img').eq(0),
            "skipButton": {text: "quit"},
            description: 'select your screen orientation, vertical or horizontal',
            timeout: 500,
            margin: 0,
            padding: 0,
            onBeforeStart: function () {
                log('STEP 3');
            }
        },
        {
            "click #resolutionList": 'select your screen resolution',
            "skipButton": {text: "quit"},
            timeout: 500,
            bottom: 250,
            margin: 0,
            right: 500,
            padding: 0,
            onBeforeStart: function () {
                log('STEP 4');
            }
        },
        {
            event: "click",
            "skipButton": {text: "quit"},
            selector: $('#screenLayoutList'),
            description: 'select your screen layout</text><br/>Each screen division (area) will run some different content',
            timeout: 500,
            bottom: 250,
            onBeforeStart: function () {
                log('STEP 5');
            }
        },
        {
            "next #screenSelectorContainer": 'this is your Timelines</text><br/>you can create multiple timelines to play one after the other<br/>each timeline includes one or more channels',
            timeout: 1500,
            "skipButton": {text: "quit"}
        },
        {
            "click #toggleStorylineCollapsible": 'click to expand and see your timeline details</text><br/>',
            "skipButton": {text: "quit"},
            onBeforeStart: function () {
                //todo: fix
                // BB.comBroker.getService(BB.SERVICES.STORYLINE).collapseStoryLine();
                log('STEP 6');
            }
        },
        {
            "next #storylineContainerCollapse": 'these are your channels<br/></text>each channel is automatically assigned to one screen division<br/>right now your channels are empty (no fun)',
            "skipButton": {text: "quit"},
            onBeforeStart: function () {
                log('STEP 7');
            }
        },
        {
            "click #selectNextChannel": 'select next channel<br/></text>with this button you can simply cycle through all<br/>the channels of the currently selected timeline, its simple...',
            "skipButton": {text: "quit"},
            left: 6,
            right: 6,
            top: 6,
            bottom: 6,
            onBeforeStart: function () {
                log('STEP 8');
            }
        },
        {
            "click #addBlockButton": 'add content<br/></text>Click [+] to add content to your selected channel (and matching screen division)',
            "skipButton": {text: "quit"},
            left: 6,
            right: 6,
            top: 6,
            bottom: 6,
            onBeforeStart: function () {
                log('STEP 9');
            }
        },
        {
            event: "click",
            "skipButton": {text: "quit"},
            selector: $('#addResourcesBlockListContainer a'),
            description: 'select resource<br/></text>Add images, videos and other files<br/>(later you can also upload file from your own PC)',
            timeout: 400,
            padding: 15,
            margin: 15,
            onBeforeStart: function () {
                log('STEP 10');
            }
        },
        {
            event: "click",
            "skipButton": {text: "quit"},
            selector: $('#addResourceBlockList'),
            description: 'select resource<br/>',
            timeout: 1000,
            bottom: 400,
            top: 20,
            left: 25,
            right: 25,
            onBeforeStart: function () {
                log('STEP 11');
            }
        },
        {
            "click .channelListItems": 'now the resource has been added to the selected channel</text><br/>just go ahead and select it to load up its properties',
            "skipButton": {text: "quit"},
            onBeforeStart: function () {
                log('STEP 12');
            }
        },
        {
            "next #blockProperties": 'additional properties<br/></text>anytime you select anything in StudioLite,<br/>be sure to checkout the properties box<br/>on the right for additional options and settings',
            "skipButton": {text: "quit"},
            onBeforeStart: function () {
                log('STEP 13');
            }
        },
        {
            "next #channelBlockProps": 'resource duration<br/></text>like here, where you can set the playback duration<br/>of your currently selected resource,<br/>the one that you just added',
            "skipButton": {text: "quit"},
            onBeforeStart: function () {
                log('STEP 14');
            }
        },
        {
            "click #editScreenLayout": 'edit your screen division layout<br/></text>use this button to edit your current screen layout',
            "skipButton": {text: "quit"},
            left: 6,
            right: 6,
            top: 6,
            bottom: 6,
            onBeforeStart: function () {
                log('STEP 15');
            }
        },
        {
            "click #layoutEditorAddNew": 'lets add a new screen division<br/></text>it will automatically be assigned a channel on your timeline',
            "skipButton": {text: "quit"},
            left: 8,
            right: 8,
            top: 6,
            bottom: 6,
            onBeforeStart: function () {
                log('STEP 16');
            }
        },
        {
            "next #screenLayoutEditorCanvasWrap": 'position and size your new screen division',
            "skipButton": {text: "quit"},
            bottom: 200,
            right: 100,
            onBeforeStart: function () {
                log('STEP 17');
            }
        },
        {
            event: "click",
            selector: $('#prev', "#screenLayoutEditorView"),
            "skipButton": {text: "quit"},
            description: 'go back when done',
            onBeforeStart: function () {
                log('STEP 18');
            }
        },
        {
            event: "click",
            selector: '#screenSelectorContainerCollapse',
            "skipButton": {text: "quit"},
            description: 'click the newly created screen division to continue<br/></text>notice how the screen division was automatically assigned a new channel',
            timeout: 500,
            bottom: 10,
            onBeforeStart: function () {
                log('STEP 19');
            }
        },
        {
            event: "click",
            selector: $('.scenesPanel', '#appNavigator'),
            "skipButton": {text: "quit"},
            description: 'mixing content</text><br/>sometimes you want to mix resources and components into a single screen division<br/>Scenes are perfect for that',
            right: 10,
            top: 6,
            bottom: 10,
            onBeforeStart: function () {
                log('STEP 20');
            }
        },

        {
            event: "click",
            selector: $('#newScene'),
            "skipButton": {text: "quit"},
            description: 'lets create a new scene',
            left: 8,
            right: 8,
            top: 5,
            bottom: 5,
            onBeforeStart: function () {
                log('STEP 21');
            }
        },
        {
            event: "click",
            selector: '#sceneSelectorList',
            "skipButton": {text: "quit"},
            description: 'select your newly created scene to edit it',
            bottom: 400,
            timeout: 300,
            onBeforeStart: function () {
                //$('#sceneSelectorList').children().:not(:last-child)')fadeOut();
                //todo: fix
                // var sceneCreationService = BB.comBroker.getService(BB.SERVICES['SCENES_CREATION_VIEW']);
                // sceneCreationService.createBlankScene('New Scene from Wizard');
                $('a:not(:last-child)', '#sceneSelectorList').slideUp();
                log('STEP 22');
            }
        },
        {
            event: "click",
            selector: '.sceneAddNew',
            "skipButton": {text: "quit"},
            description: 'lets add a new resource or component to our scene',
            right: 8,
            left: 8,
            top: 5,
            bottom: 5,
            timeout: 300,
            onBeforeStart: function () {
                log('STEP 23');
            }
        },
        {
            event: "click",
            selector: '#sceneAddNewBlock',
            "skipButton": {text: "quit"},
            description: 'select a smart component',
            timeout: 500,
            right: 300,
            left: 50,
            top: 175,
            onBeforeStart: function () {
                log('STEP 24');
                $('#sceneAddNewBlock').find('[data-toggle]').trigger('click');
                $('.primeComponent').closest('.addBlockListItems').hide();
                $('#addResourcesBlockListContainer', '#sceneAddNewBlock').hide();
            }
        },
        {
            "next #sceneCanvas": 'edit your scene</text><br/>now you can position your content<br/>anywhere you like, resize it and change any of the properties',
            event: "next",
            timeout: 300,
            bottom: 200,
            "skipButton": {text: "quit"},
            onBeforeStart: function () {
                log('STEP 25');
            }
        },
        {
            event: "click",
            selector: '.sceneAddNew',
            "skipButton": {text: "quit"},
            description: 'lets add another resource',
            right: 8,
            left: 8,
            top: 5,
            bottom: 5,
            timeout: 300,
            onBeforeStart: function () {
                log('STEP 26');
            }
        },
        {
            event: "click",
            selector: '#sceneAddNewBlock',
            "skipButton": {text: "quit"},
            description: 'select a smart component',
            timeout: 500,
            right: 300,
            left: 50,
            top: 175,
            onBeforeStart: function () {
                log('STEP 27');
                $('#sceneAddNewBlock').find('[data-toggle]').trigger('click');
                $('#addResourcesBlockListContainer', '#sceneAddNewBlock').show();
                $('#addComponentsBlockListContainer', '#sceneAddNewBlock').hide();
                $('.primeComponent').closest('.addBlockListItems').hide();
            }
        },
        {
            "next #sceneCanvas": 'again position and resize the resource',
            event: "next",
            timeout: 300,
            bottom: 200,
            "skipButton": {text: "quit"},
            onBeforeStart: function () {
                log('STEP 28');
            }
        },
        {
            event: "click",
            selector: $('.campaignManagerView', '#appNavigator'),
            "skipButton": {text: "quit"},
            description: 'go back to campaigns<br/></text>so we can assign our newly created scene<br/>to any timeline and channel we like',
            right: 10,
            left: 6,
            top: 10,
            bottom: 10,
            onBeforeStart: function () {
                log('STEP 29');
            }
        },
        {
            "click #toggleStorylineCollapsible": 'expand the timeline',
            "skipButton": {text: "quit"},
            onBeforeStart: function () {
                //todo: fix
                // BB.comBroker.getService(BB.SERVICES.STORYLINE).collapseStoryLine();
                log('STEP 30');
            }
        },
        {
            left: 10,
            right: 10,
            "click #selectNextChannel": 'select the next channel',
            "skipButton": {text: "quit"},
            onBeforeStart: function () {
                log('STEP 31');
            }
        },
        {
            "click #addBlockButton": 'now lets add our scene to this channel',
            left: 6,
            right: 6,
            top: 6,
            bottom: 6,
            "skipButton": {text: "quit"},
            onBeforeStart: function () {
                log('STEP 32');
                $('#addResourcesBlockListContainer').find('[data-toggle]').trigger('click');
            }
        },
        {
            event: "click",
            "skipButton": {text: "quit"},
            selector: $('#addSceneBlockListContainer a'),
            description: 'select scenes to get a list of all available scenes',
            timeout: 400,
            padding: 15,
            margin: 15,
            onBeforeStart: function () {
                log('STEP 33');
            }
        },
        {
            event: "click",
            "skipButton": {text: "quit"},
            selector: $('#addSceneBlockList'),
            description: 'select your scene<br/></text>it will automatically get added to<br/>your selected channel',
            timeout: 700,
            left: 25,
            right: 25,
            bottom: 25,
            top: 25,
            onBeforeStart: function () {
                log('STEP 34');
            }
        },
        {
            event: "click",
            selector: $('.installPanel', '#appNavigator'),
            "skipButton": {text: "quit"},
            timeout: 600,
            description: 'next lets switch to Install',
            right: 10,
            top: 10,
            bottom: 10,
            hideInEnterprise: true,
            onBeforeStart: function () {
                log('STEP 35');
            }
        },
        {
            "next #installPanel": 'install SignagePlayer</text><br/>now you need to register a physical player<br/>and connect it to any type of screen you like',
            hideInEnterprise: true,
            "skipButton": {text: "quit"},
            onBeforeStart: function () {
                log('STEP 36');
            }
        },
        {
            "next #installPanel": 'choose an OS</text><br/>you can pick from Android, Windows or even order our hardware (recommended)<br/>as it comes plug and play ready to impress your audience',
            "skipButton": {text: "quit"},
            hideInEnterprise: true,
            onBeforeStart: function () {
                log('STEP 37');
            }
        },
        {
            event: "click",
            selector: $('.stationsPanel', '#appNavigator'),
            "skipButton": {text: "quit"},
            timeout: 600,
            top: 10,
            bottom: 10,
            description: 'now lets switch to stations',
            right: 10,
            onBeforeStart: function () {
                log('STEP 38');
            }
        },
        {
            "next #stationsPanel": 'station management</text><br/>here you manage remote screens<br/>(stations) and assign them any campaign you like',
            timeout: 600,
            "skipButton": {text: "quit"},
            bottom: 400,
            onBeforeStart: function () {
                log('STEP 39');
            }
        },
        {
            event: "click",
            selector: $('.helpPanel', '#appNavigator'),
            "skipButton": {text: "quit"},
            timeout: 600,
            description: 'switch into help, we are almost done',
            right: 10,
            top: 10,
            bottom: 10,
            hideInEnterprise: true,
            onBeforeStart: function () {
                log('STEP 40');
            }
        },
        {
            "next #helpPanel": 'here you will find video tutorials for additional help',
            timeout: 200,
            hideInEnterprise: true,
            "skipButton": {text: "quit"},
            onBeforeStart: function () {
                log('STEP 41');
            }
        },
        {
            event: "next",
            timeout: 200,
            selector: $('#appEntry'),
            "skipButton": {text: "quit"},
            description: 'well done!</text><br/>give yourself a pat on the back',
            bottom: 600,
            onBeforeStart: function () {
                log('STEP 42');
                setTimeout(function () {
                    $('#enjoyhint_arrpw_line').fadeOut();
                }, 1000);
            }
        }
    ];


    constructor() {
    }

    //
    // "wstep0": "<text>a quick 5 minute tutorial</text><br/>and we will teach you how to use StudioLite... its easy.",
    // "wstep1": "<text>name your campaign, press [ENTER] when done</text><br/>this will become useful later<br/>when you assign your campaign to a remote screen<br/>(a screen is also referred to as a <u>station</u>)",
    // "wstep10": "<text>select resource<br/></text>Add images, videos and other files<br/>(later you can also upload file from your own PC)",
    // "wstep11": "<text>select resource<br/></text>",
    // "wstep12": "<text>now the resource has been added to the selected channel</text><br/>just go ahead and select it to load up its properties",
    // "wstep13": "<text>additional properties<br/></text>anytime you select anything in StudioLite,<br/>be sure to checkout the properties box<br/>on the right for additional options and settings",
    // "wstep14": "<text>resource duration<br/></text>like here, where you can set the playback duration<br/>of your currently selected resource,<br/>the one that you just added",
    // "wstep15": "<text>edit your screen division layout<br/></text>use this button to edit your current screen layout",
    // "wstep16": "<text>lets add a new screen division<br/></text>it will automatically be assigned a channel on your timeline",
    // "wstep17": "<text>position and size your new screen division",
    // "wstep18": "<text>go back when done</text>",
    // "wstep19": "<text>click the newly created screen division to continue<br/></text>notice how the screen division was automatically assigned a new channel",
    // "wstep2": "<text>select your screen orientation, vertical or horizontal</text>",
    // "wstep20": "<text>mixing content</text><br/>sometimes you want to mix resources and components into a single screen division<br/>Scenes are perfect for that",
    // "wstep21": "<text>lets create a new scene</text>",
    // "wstep22": "<text>select your newly created scene to edit it</text>",
    // "wstep23": "<text>lets add a new resource or component to our scene</text>",
    // "wstep24": "<text>select a smart component</text>",
    // "wstep25": "<text>edit your scene</text><br/>now you can position your content<br/>anywhere you like, resize it and change any of the properties",
    // "wstep26": "<text>lets add another resource</text>",
    // "wstep27": "<text>assign scene to channel</text>will switch back to campaigns to assign the scene to any timeline we like",
    // "wstep28": "<text>again position and resize the resource</text>",
    // "wstep29": "<text>go back to campaigns<br/></text>so we can assign our newly created scene<br/>to any timeline and channel we like",
    // "wstep3": "<text>select your screen resolution</text>",
    // "wstep30": "<text>expand the timeline</text>",
    // "wstep31": "<text>select the next channel</text>",
    // "wstep32": "<text>now lets add our scene to this channel</text>",
    // "wstep33": "<text>select scenes to get a list of all available scenes</text>",
    // "wstep34": "<text>select your scene<br/></text>it will automatically get added to<br/>your selected channel",
    // "wstep35": "<text>next lets switch to Install</text>",
    // "wstep36": "<text>install SignagePlayer</text><br/>now you need to register a physical player<br/>and connect it to any type of screen you like",
    // "wstep37": "<text>choose an OS</text><br/>you can pick from Android, Windows or even order our hardware (recommended)<br/>as it comes plug and play ready to impress your audience",
    // "wstep38": "<text>now lets switch to stations</text>",
    // "wstep39": "<text>station management</text><br/>here you manage remote screens<br/>(stations) and assign them any campaign you like",
    // "wstep4": "<text>select your screen layout</text><br/>Each screen division (area) will run some different content",
    // "wstep40": "<text>switch into help, we are almost done",
    // "wstep41": "<text>here you will find video tutorials for additional help</text>",
    // "wstep42": "<text>well done!</text><br/>give yourself a pat on the back",
    // "wstep43": "<text></text>",
    // "wstep44": "<text></text>",
    // "wstep45": "<text></text>",
    // "wstep46": "<text></text>",
    // "wstep47": "<text></text>",
    // "wstep48": "<text></text>",
    // "wstep49": "<text></text>",
    // "wstep5": "<text>this is your Timelines</text><br/>you can create multiple timelines to play one after the other<br/>each timeline includes one or more channels",
    // "wstep50": "<text></text>",
    // "wstep6": "<text>click to expand and see your timeline details</text><br/>",
    // "wstep7": "<text>these are your channels<br/></text>each channel is automatically assigned to one screen division<br/>right now your channels are empty (no fun)",
    // "wstep8": "<text>select next channel<br/></text>with this button you can simply cycle through all<br/>the channels of the currently selected timeline, its simple...",
    // "wstep9": "<text>add content<br/></text>Click [+] to add content to your selected channel (and matching screen division)",

    public inModule(i_name: string) {
        this.m_enjoyHint = new EnjoyHint({
            onStart: () => {
            },
            onEnd: () => {
                this._closeWizard();
            },
            onSkip: () => {
                this._closeWizard();
            }
        });

        var enjoyhint_script_steps;
        switch (i_name) {
            case 'campaigns': {
                enjoyhint_script_steps = [
                    {
                        'click #newCampaign': 'Click the "New" button to start creating your project'
                    }
                ];
                break;
            }

            case 'scenes': {
                enjoyhint_script_steps = [
                    {
                        'click #newScene': 'Click the "New" button to start creating your project'
                    }
                ];
                break;
            }
        }
        this.m_enjoyHint.set(enjoyhint_script_steps);
        this.m_enjoyHint.run();
    }

    _closeWizard() {
        console.log('wizard closed');
    }
}