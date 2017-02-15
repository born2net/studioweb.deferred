import {Injectable} from "@angular/core";
import {Action, Store} from "@ngrx/store";
import {ApplicationState} from "../store/application.state";
import {Observable} from "rxjs";
import {CampaignsModelExt} from "../store/model/msdb-models-extended";
import {
    BoardsModel,
    BoardTemplatesModel,
    BoardTemplateViewersModel,
    CampaignTimelineBoardTemplatesModel,
    CampaignTimelineBoardViewerChanelsModel, CampaignTimelineChanelPlayersModel,
    CampaignTimelineChanelsModel,
    CampaignTimelineSchedulesModel,
    CampaignTimelineSequencesModel,
    CampaignTimelinesModel
} from "../store/imsdb.interfaces_auto";
import {IScreenTemplateData} from "../comps/screen-template/screen-template";
import {OrientationEnum} from "../app/campaigns/campaign-orientation";
import {List} from "immutable";
import * as _ from "lodash";

@Injectable()
export class YellowPepperService {

    constructor(private store: Store<ApplicationState>) {
    }

    public dispatch(action: Action) {
        this.store.dispatch(action);
    }

    public get ngrxStore(): Store<ApplicationState> {
        return this.store;
    }

    /**
     Listen to when a campaign timeline channel is selected
     **/
    listenChannelSelected(emitOnEmpty: boolean = false): Observable<CampaignTimelineChanelsModel> {
        var channelSelected$ = this.store.select(store => store.appDb.uiState.campaign.campaignTimelineChannelSelected);
        var channelsList$ = this.store.select(store => store.msDatabase.sdk.table_campaign_timeline_chanels);
        return channelSelected$.withLatestFrom(
            channelsList$,
            (channelId, channels) => {
                return channels.find((i_channel: CampaignTimelineChanelsModel) => {
                    return i_channel.getCampaignTimelineChanelId() == channelId;
                });
            }).mergeMap(v => (v ? Observable.of(v) : ( emitOnEmpty ? Observable.of(v) : Observable.empty())));
    }

    /**
     Listen to when a timeline is selected via the store state uiState.campaign.timelineSelected
     **/
    listenTimelineSelected(emitOnEmpty: boolean = false): Observable<CampaignTimelinesModel> {
        var timelineSelected$ = this.store.select(store => store.appDb.uiState.campaign.timelineSelected);
        var timelineList$ = this.store.select(store => store.msDatabase.sdk.table_campaign_timelines);
        return timelineSelected$
            .withLatestFrom(
                timelineList$,
                (timelineId, timelines) => {
                    return timelines.find((i_timeline: CampaignTimelinesModel) => {
                        return i_timeline.getCampaignTimelineId() == timelineId;
                    });
                }).mergeMap(v => (v ? Observable.of(v) : ( emitOnEmpty ? Observable.of(v) : Observable.empty())));
    }

    /**
     listen UI campaign > timeline > board_viewer selected and return back the associated channel with that board id
     **/
    listenCampaignTimelineBoardViewerSelected(emitOnEmpty: boolean = false): Observable<CampaignTimelineBoardViewerChanelsModel> {
    // listenCampaignTimelineBoardViewerSelected(): Observable<CampaignTimelineBoardViewerChanelsModel> {
        var boardSelected$ = this.store.select(store => store.appDb.uiState.campaign.campaignTimelineBoardViewerSelected);
        var $viewerChannels$ = this.store.select(store => store.msDatabase.sdk.table_campaign_timeline_board_viewer_chanels);
        return boardSelected$
            .withLatestFrom(
                $viewerChannels$,
                (boardId, viewerChannels) => {
                    if (emitOnEmpty && (!boardId || boardId == -1)) return null;
                    return viewerChannels.find((i_viewerChannel: CampaignTimelineBoardViewerChanelsModel) => {
                        return i_viewerChannel.getBoardTemplateViewerId() == boardId;
                    });
                }).mergeMap(v => (v ? Observable.of(v) : ( emitOnEmpty ? Observable.of(v) : Observable.empty())));
    }

    listenTimelineDurationChanged(emitOnEmpty: boolean = false) {
        var $timelinesList$ = this.store.select(store => store.msDatabase.sdk.table_campaign_timelines);
        return this.listenCampaignSelected()
            .combineLatest($timelinesList$, (campaign, timelines) => {
                return campaign
            }).mergeMap(campaign => {
                return this.getCampaignTimelines(campaign.getCampaignId())
            }).mergeMap((i_timelines: List<CampaignTimelinesModel>) => {
                var total = 0;
                i_timelines.forEach((v) => {
                    var t = parseInt(v.getTimelineDuration());
                    total = total + t;
                })
                return Observable.of(total);
            })
    }

    listenGlobalBoardSelectedChanged(emitOnEmpty: boolean = false): Observable<BoardTemplateViewersModel> {
        var globalBoardTemplateViewerSelected$ = this.ngrxStore.select(store => store.appDb.uiState.campaign.campaignTimelineBoardViewerSelected);
        var tableBoardTemplatesList$ = this.ngrxStore.select(store => store.msDatabase.sdk.table_board_template_viewers);
        return globalBoardTemplateViewerSelected$
            .combineLatest(tableBoardTemplatesList$, (globalBoardTemplateViewerId: number, boards: List<BoardTemplateViewersModel>) => {
                return boards.find((i_board: BoardTemplateViewersModel) => {
                    return i_board.getBoardTemplateViewerId() == globalBoardTemplateViewerId;
                });
            }).mergeMap(v => (v ? Observable.of(v) : ( emitOnEmpty ? Observable.of(v) : Observable.empty())));
    }

    /**
     Listen to ONLY when a campaign is selected via the store state uiState.campaign.campaignSelected and grab latest CampaignModel
     **/
    listenCampaignSelected(emitOnEmpty: boolean = false): Observable<CampaignsModelExt> {
        var campaignSelected$ = this.store.select(store => store.appDb.uiState.campaign.campaignSelected);
        var campaignsList$ = this.store.select(store => store.msDatabase.sdk.table_campaigns);
        return campaignSelected$
            .withLatestFrom(
                campaignsList$,
                (campaignId, campaigns) => {
                    return campaigns.find((i_campaign: CampaignsModelExt) => {
                        return i_campaign.getCampaignId() == campaignId;
                    });
                }).mergeMap(v => (v ? Observable.of(v) : ( emitOnEmpty ? Observable.of(v) : Observable.empty())));
    }

    /**
     Listen to when a channel that is selected changed value
     **/
    listenChannelValueChanged(emitOnEmpty: boolean = false): Observable<CampaignTimelineChanelsModel> {
        var channelIdSelected$ = this.ngrxStore.select(store => store.appDb.uiState.campaign.campaignTimelineChannelSelected)
        var channels$ = this.ngrxStore.select(store => store.msDatabase.sdk.table_campaign_timeline_chanels);
        return channelIdSelected$
            .combineLatest(channels$, (channelId: number, channels: List<CampaignTimelineChanelsModel>) => {
                return channels.find((i_channel: CampaignTimelineChanelsModel) => {
                    return i_channel.getCampaignTimelineChanelId() == channelId;
                });
            }).mergeMap(v => (v ? Observable.of(v) : ( emitOnEmpty ? Observable.of(v) : Observable.empty())));
    }


    /**
     Listen to when a campaign that is selected changed value
     **/
    listenCampaignValueChanged(emitOnEmpty: boolean = false): Observable<CampaignsModelExt> {
        var campaignIdSelected$ = this.ngrxStore.select(store => store.appDb.uiState.campaign.campaignSelected)
        var campaigns$ = this.ngrxStore.select(store => store.msDatabase.sdk.table_campaigns);
        return campaignIdSelected$
            .combineLatest(campaigns$, (campaignId: number, campaigns: List<CampaignsModelExt>) => {
                return campaigns.find((i_campaign: CampaignsModelExt) => {
                    return i_campaign.getCampaignId() == campaignId;
                });
            }).mergeMap(v => (v ? Observable.of(v) : ( emitOnEmpty ? Observable.of(v) : Observable.empty())));
    }


    /**
     Listen to when a scheduler that is selected changed value
     **/
    listenSchedulerValueChanged(emitOnEmpty: boolean = false): Observable<CampaignTimelineSchedulesModel> {
        var campaignTimelineIdSelected$ = this.ngrxStore.select(store => store.appDb.uiState.campaign.timelineSelected)
        var schedules$ = this.ngrxStore.select(store => store.msDatabase.sdk.table_campaign_timeline_schedules);
        return campaignTimelineIdSelected$
            .combineLatest(schedules$, (campaignSchedarId: number, schedules: List<CampaignTimelineSchedulesModel>) => {
                return schedules.find((i_schedules: CampaignTimelineSchedulesModel) => {
                    return i_schedules.getCampaignTimelineId() == campaignSchedarId;
                });
            }).mergeMap(v => (v ? Observable.of(v) : ( emitOnEmpty ? Observable.of(v) : Observable.empty())));
    }

    /**
     get time line total duration by channel
     **/
    getTimelineTotalDurationByChannel(i_campaign_timeline_id): Observable<number> {
        var table_campaign_timeline_chanels$ = this.ngrxStore.select(store => store.msDatabase.sdk.table_campaign_timeline_chanels)
        var table_campaign_timeline_chanel_players$ = this.ngrxStore.select(store => store.msDatabase.sdk.table_campaign_timeline_chanel_players)
        return Observable.combineLatest(table_campaign_timeline_chanels$, table_campaign_timeline_chanel_players$,
            (table_campaign_timeline_chanels: List<CampaignTimelineChanelsModel>,
             table_campaign_timeline_chanel_players: List<CampaignTimelineChanelPlayersModel>) => {
                var longestChannelDuration = 0;
                // loop over channels of timeline and sum up lengths
                table_campaign_timeline_chanels.forEach(i_campaignTimelineChanelsModel => {
                    if (i_campaignTimelineChanelsModel.getCampaignTimelineId() == i_campaign_timeline_id) {
                        // console.log('found channel ' + i_campaignTimelineChanelsModel.getChanelName());
                        var timelineDuration = 0;
                        table_campaign_timeline_chanel_players.forEach(i_campaignTimelineChanelPlayersModel => {
                            if (i_campaignTimelineChanelPlayersModel.getCampaignTimelineChanelId() == i_campaignTimelineChanelsModel.getCampaignTimelineChanelId()) {
                                timelineDuration += parseFloat(i_campaignTimelineChanelPlayersModel.getPlayerDuration());
                                if (timelineDuration > longestChannelDuration)
                                    longestChannelDuration = timelineDuration;
                            }
                        })
                        // console.log('total ' + timelineDuration + ' longest so far ' + longestChannelDuration);
                    }
                })
                // console.log('winner ' + longestChannelDuration);
                return longestChannelDuration;
            })
    }

    /**
     Get a timeline's duration which is set as the total sum of all blocks within the longest running channel
     **/
    getTimelineTotalDuration(i_campaign_timeline_id): Observable<string> {
        return this.store.select(store => store.msDatabase.sdk.table_campaign_timelines)
            .map((campaignTimelinesModels: List<CampaignTimelinesModel>) => {
                return campaignTimelinesModels.reduce((result: string, campaignTimelineModel) => {
                    if (campaignTimelineModel.getCampaignTimelineId() == i_campaign_timeline_id)
                        result = campaignTimelineModel.getTimelineDuration();
                    return result;
                }, '')
            }).take(1);
    }

    /**
     Get all timeline s for specified campaign id
     **/
    getNewCampaignParmas(): Observable<{}> {
        return this.store.select(store => store.appDb.uiState.campaign)
            .take(1)
    }

    /**
     Use a viewer_id to reverse enumerate over the mapping of viewers to channels via:
     campaign_timeline_viewer_chanels -> table_campaign_timeline_chanels
     so we can find the channel assigned to the viewer_id provided.
     **/
    getChannelFromCampaignTimelineBoardViewer(i_campaign_timeline_board_viewer_id): Observable<CampaignTimelineChanelsModel> {
        return this.ngrxStore.select(store => store.msDatabase.sdk.table_campaign_timeline_board_viewer_chanels)
            .map((i_campaignTimelineBoardViewerChanels: List<CampaignTimelineBoardViewerChanelsModel>) => {
                return i_campaignTimelineBoardViewerChanels.find((i_campaignTimelineBoardViewerChanel: CampaignTimelineBoardViewerChanelsModel) => {
                    return i_campaignTimelineBoardViewerChanel.getCampaignTimelineBoardViewerChanelId() == i_campaign_timeline_board_viewer_id;
                })
            }).concatMap((v: CampaignTimelineBoardViewerChanelsModel) => {
                return this.getChannelOfTimeline(v.getCampaignTimelineChanelId())
            }).take(1);
    }

    /**
     Get all the campaign > timeline > channel of a timeline
     **/
    getChannelOfTimeline(i_campaign_timeline_chanel_id): Observable<CampaignTimelineChanelsModel> {
        return this.store.select(store => store.msDatabase.sdk.table_campaign_timeline_chanels)
            .map((campaignTimelineChanels: List<CampaignTimelineChanelsModel>) => {
                return campaignTimelineChanels.find((campaignTimelineChanelsModel: CampaignTimelineChanelsModel) => {
                    return campaignTimelineChanelsModel.getCampaignTimelineChanelId() == i_campaign_timeline_chanel_id
                })
            }).take(1);
    }

    /**
     Get all the block IDs of a particular channel.
     Push them into an array so they are properly sorted by player offset time.
     **/
    getChannelBlocks(i_campaign_timeline_chanel_id): Observable<Array<number>> {
        return this.store.select(store => store.msDatabase.sdk.table_campaign_timeline_chanel_players)
            .map((campaignTimelineChanelPlayersModels: List<CampaignTimelineChanelPlayersModel>) => {
                return campaignTimelineChanelPlayersModels.reduce((result: Array<number>, campaignTimelineChanelsModel) => {
                    if (campaignTimelineChanelsModel.getCampaignTimelineChanelId() == i_campaign_timeline_chanel_id)
                        result.push(campaignTimelineChanelsModel.getCampaignTimelineChanelPlayerId());
                    return result;
                }, [])
            }).take(1);
    }

    /**
     Get a player_id record from sdk by player_id primary key.
     **/
    getBlockRecord(i_player_id): Observable<CampaignTimelineChanelPlayersModel> {
        return this.store.select(store => store.msDatabase.sdk.table_campaign_timeline_chanel_players)
            .map((i_campaignTimelineChanelPlayersModels: List<CampaignTimelineChanelPlayersModel>) => {
                return i_campaignTimelineChanelPlayersModels
                    .find((i_campaignTimelineChanelPlayersModel) => {
                        return i_campaignTimelineChanelPlayersModel.getCampaignTimelineChanelPlayerId() == i_player_id
                    })
            }).take(1)
    }

    /**
     get a scene block playerdata
     **/
    getScenePlayerdataBlock(i_scene_id, i_player_data_id) {

        // i_scene_id = this.sterilizePseudoId(i_scene_id);
        // this.databaseManager.table_player_data().openForEdit(i_scene_id);
        // var recPlayerData = this.databaseManager.table_player_data().getRec(i_scene_id);
        // var player_data = recPlayerData['player_data_value'];
        // var domPlayerData = $.parseXML(player_data)
        // var foundSnippet = $(domPlayerData).find('[id="' + i_player_data_id + '"]');
        // return foundSnippet[0];
    }

    /**
     Get all the campaign > timeline > channels ids of a timeline
     **/
    getChannelsOfTimeline(i_campaign_timeline_id): Observable<any> {
        return this.store.select(store => store.msDatabase.sdk.table_campaign_timeline_chanels)
            .map((campaignTimelineChanels: List<CampaignTimelineChanelsModel>) => {
                return campaignTimelineChanels.reduce((result: Array<number>, campaignTimelineChanelsModel) => {
                    if (campaignTimelineChanelsModel.getCampaignTimelineId() == i_campaign_timeline_id)
                        result.push(campaignTimelineChanelsModel.getCampaignTimelineChanelId());
                    return result;
                }, [])
            }).take(1);
    }

    /**
     Get all timeline s for specified campaign id
     **/
    getCampaignTimelines(i_campaign_id: number): Observable<List<CampaignTimelinesModel>> {
        return this.store.select(store => store.msDatabase.sdk.table_campaign_timelines)
            .map((campaignTimelinesModels: List<CampaignTimelinesModel>) => {
                return campaignTimelinesModels.filter((campaignTimelinesModel: CampaignTimelinesModel) => {
                    return campaignTimelinesModel.getCampaignId() == i_campaign_id;
                });
            }).take(1);
    }

    /**
     Get a block's (a.k.a player) total hours / minutes / seconds playback length on the timeline_channel.
     **/
    getBlockTimelineChannelBlockLength(i_campaign_timeline_chanel_player_id): Observable<number> {
        return this.store.select(store => store.msDatabase.sdk.table_campaign_timeline_chanel_players)
            .map((i_players: List<CampaignTimelineChanelPlayersModel>) => {
                return i_players.reduce((result: number, i_player) => {
                    if (i_player.getCampaignTimelineChanelPlayerId() == i_campaign_timeline_chanel_player_id)
                        result = i_player.getPlayerDuration();
                    return result;
                }, 0)
            }).take(1);
    }

    /**
     Get the sequence index of a timeline in the specified campaign
     **/
    getCampaignTimelineSequencerIndex(i_campaign_timeline_id): Observable<number> {
        return this.store.select(store => store.msDatabase.sdk.table_campaign_timeline_sequences)
            .map((campaignTimelineSequencesModels: List<CampaignTimelineSequencesModel>) => {
                var found: CampaignTimelineSequencesModel = campaignTimelineSequencesModels.find((campaignTimelineSequencesModel: CampaignTimelineSequencesModel) => {
                    return campaignTimelineSequencesModel.getCampaignTimelineId() == i_campaign_timeline_id
                });
                return found.getSequenceIndex();
            }).take(1);
    }

    /**
     Get the sequence index of a timeline in the specified campaign
     **/
    getCampaignsSchedule(i_campaign_timeline_id): Observable<CampaignTimelineSchedulesModel> {
        return this.store.select(store => store.msDatabase.sdk.table_campaign_timeline_schedules)
            .map((campaignTimelineSchedulesModel: List<CampaignTimelineSchedulesModel>) => {
                return campaignTimelineSchedulesModel.find((campaignTimelineSchedulesModel: CampaignTimelineSchedulesModel) => {
                    return campaignTimelineSchedulesModel.getCampaignTimelineId() == i_campaign_timeline_id
                });
            }).take(1);
    }

    /**
     Get all the global board template ids of a timeline
     * **/
    getGlobalTemplateIdOfTimeline(i_campaign_timeline_id): Observable<Array<number>> {
        return this.store.select(store => store.msDatabase.sdk.table_campaign_timeline_board_templates)
            .map((campaignTimelineBoardTemplatesModels: List<CampaignTimelineBoardTemplatesModel>) => {
                return campaignTimelineBoardTemplatesModels.reduce((result: Array<number>, campaignTimelineBoardTemplatesModel) => {
                    if (campaignTimelineBoardTemplatesModel.getCampaignTimelineId() == i_campaign_timeline_id)
                        result.push(campaignTimelineBoardTemplatesModel.getBoardTemplateId());
                    return result;
                }, [])
            }).take(1);
    }

    /**
     Get all the campaign > timeline > board > template ids of a timeline
     **/
    getTemplatesOfTimeline(i_campaign_timeline_id): Observable<Array<number>> {
        return this.store.select(store => store.msDatabase.sdk.table_campaign_timeline_board_templates)
            .map((campaignTimelineBoardTemplatesModels: List<CampaignTimelineBoardTemplatesModel>) => {
                return campaignTimelineBoardTemplatesModels.reduce((result: Array<number>, campaignTimelineBoardTemplatesModel) => {
                    if (campaignTimelineBoardTemplatesModel.getCampaignTimelineId() == i_campaign_timeline_id)
                        result.push(campaignTimelineBoardTemplatesModel.getCampaignTimelineBoardTemplateId());
                    return result;
                }, [])
            }).take(1);
    }

    /**
     *
     * Get a channel associated with the selected viewer
     */
    getChannelFromViewer(i_selectedTimeline_id, i_campaign_timeline_board_viewer_id): Observable<{}> {
        return this.getChannelsOfTimeline(i_selectedTimeline_id).switchMap((timeline_channel_ids: Array<number>) => {
            return Observable.from(timeline_channel_ids).concatMap((channel: number) => {
                return this.getAssignedViewerIdFromChannelId(channel)
                    .map(viewer_id => {
                        if (viewer_id == i_campaign_timeline_board_viewer_id) {
                            return {viewer_id, channel};
                        } else {
                            return null;
                        }
                    }).skipWhile(value => value == null)
            })
        }).take(1);
    }

    /**
     Get the assigned viewer id to the specified channel
     **/
    getAssignedViewerIdFromChannelId(i_campaign_timeline_channel_id): Observable<number> {
        return this.store.select(store => store.msDatabase.sdk.table_campaign_timeline_board_viewer_chanels)
            .map((campaignTimelineBoardViewerChanelsModel: List<CampaignTimelineBoardViewerChanelsModel>) => {
                return campaignTimelineBoardViewerChanelsModel.reduce((result: number, campaignTimelineBoardViewerChanelsModel) => {
                    if (campaignTimelineBoardViewerChanelsModel.getCampaignTimelineChanelId() == i_campaign_timeline_channel_id)
                        result = (campaignTimelineBoardViewerChanelsModel.getBoardTemplateViewerId());
                    return result;
                }, -1)
            }).take(1);
    }

    /**
     Get a timeline model from timeline id
     **/
    getTimeline(i_campaign_timeline_id): Observable<CampaignTimelinesModel> {
        return this.store.select(store => store.msDatabase.sdk.table_campaign_timelines)
            .map((campaignTimelinesModels: List<CampaignTimelinesModel>) => {
                return campaignTimelinesModels.find((campaignTimelineModel) => {
                    return campaignTimelineModel.getCampaignTimelineId() == i_campaign_timeline_id
                })
            }).take(1);
    }

    /**
     Build screenProps json object with all viewers and all of their respective attributes for the given timeline_id / template_id
     **/
    getTemplateViewersScreenProps(i_campaign_timeline_id, i_campaign_timeline_board_template_id, timelineName = ''): Observable<IScreenTemplateData> {

        var table_campaign_timeline_board_templates$ = this.store.select(store => store.msDatabase.sdk.table_campaign_timeline_board_templates);
        var table_campaign_timeline_board_viewer_chanels$ = this.store.select(store => store.msDatabase.sdk.table_campaign_timeline_board_viewer_chanels);
        var table_board_template_viewers$ = this.store.select(store => store.msDatabase.sdk.table_board_template_viewers);
        var table_board_templates = this.store.select(store => store.msDatabase.sdk.table_board_templates);
        var table_boards$ = this.store.select(store => store.msDatabase.sdk.table_boards);

        var counter = -1;
        var screenProps = {};
        var viewOrderIndexes = {};
        var boardWidth;
        var boardHeight;
        var boardOrientation;

        return Observable.combineLatest(
            table_campaign_timeline_board_templates$,
            table_board_template_viewers$,
            table_campaign_timeline_board_viewer_chanels$,
            table_board_templates,
            table_boards$,

            (campaignTimelineBoardTemplatesModels: List<CampaignTimelineBoardTemplatesModel>,
             boardTemplateViewersModels: List<BoardTemplateViewersModel>,
             campaignTimelineBoardViewerChanelsModels: List<CampaignTimelineBoardViewerChanelsModel>,
             boardTemplates: List<BoardTemplatesModel>,
             boardsModel: List<BoardsModel>) => {

                campaignTimelineBoardViewerChanelsModels.forEach((campaignTimelineBoardViewerChanelsModel: CampaignTimelineBoardViewerChanelsModel, v) => {

                    if (campaignTimelineBoardViewerChanelsModel.getCampaignTimelineBoardTemplateId() == i_campaign_timeline_board_template_id) {

                        var board_template_viewer_id = campaignTimelineBoardViewerChanelsModel.getBoardTemplateViewerId();
                        boardTemplateViewersModels.forEach((recBoardTemplateViewer: BoardTemplateViewersModel) => {
                            if (recBoardTemplateViewer.getBoardTemplateViewerId() == board_template_viewer_id) {

                                var boardId = boardTemplates.find((boardTemplateModel) => {
                                    return boardTemplateModel.getBoardTemplateId() == recBoardTemplateViewer.getBoardTemplateId();
                                }).getBoardId();

                                var boardModel = boardsModel.find((boardModel) => {
                                    return boardModel.getBoardId() == boardId;
                                });
                                boardWidth = boardModel.getBoardPixelWidth();
                                boardHeight = boardModel.getBoardPixelHeight();
                                if (boardWidth > boardHeight) {
                                    boardOrientation = OrientationEnum.HORIZONTAL;
                                } else {
                                    boardOrientation = OrientationEnum.VERTICAL;
                                }
                                // console.log(i_campaign_timeline_board_template_id + ' ' + recBoardTemplateViewer['board_template_viewer_id']);
                                counter++;
                                screenProps['sd' + counter] = {};
                                screenProps['sd' + counter]['campaign_timeline_board_viewer_id'] = recBoardTemplateViewer.getBoardTemplateViewerId();
                                screenProps['sd' + counter]['campaign_timeline_id'] = i_campaign_timeline_id;
                                screenProps['sd' + counter]['x'] = recBoardTemplateViewer.getPixelX();
                                screenProps['sd' + counter]['y'] = recBoardTemplateViewer.getPixelY();
                                screenProps['sd' + counter]['w'] = recBoardTemplateViewer.getPixelWidth();
                                screenProps['sd' + counter]['h'] = recBoardTemplateViewer.getPixelHeight();

                                // make sure that every view_order we assign is unique and sequential
                                var viewOrder = recBoardTemplateViewer.getViewerOrder();
                                if (!_.isUndefined(viewOrderIndexes[viewOrder])) {
                                    for (var i = 0; i < 100; i++) {
                                        if (_.isUndefined(viewOrderIndexes[i])) {
                                            viewOrder = i;
                                            break;
                                        }
                                    }
                                }
                                viewOrderIndexes[viewOrder] = true;
                                screenProps['sd' + counter]['view_order'] = viewOrder;
                            }
                        })
                    }
                })
                var screenTemplateData: IScreenTemplateData = {
                    screenProps: screenProps,
                    resolution: `${boardWidth}x${boardHeight}`,
                    screenType: '',
                    orientation: boardOrientation,
                    name: timelineName,
                    scale: 14,
                    campaignTimelineId: i_campaign_timeline_id,
                    campaignTimelineBoardTemplateId: i_campaign_timeline_board_template_id
                }
                return screenTemplateData;
            }).take(1)
    }

    /**
     Get campaigns from campaign id
     **/
    getCampaign(i_campaign_id: number): Observable<CampaignsModelExt> {
        return this.store.select(store => store.msDatabase.sdk.table_campaigns)
            .map((campaignModels: List<CampaignsModelExt>) => {
                return campaignModels.find((campaignModel: CampaignsModelExt) => {
                    return campaignModel.getCampaignId() == i_campaign_id;
                });
            }).take(1);
    }


    /*****************************************************/
    // below are some brain dumps and examples only
    /*****************************************************/

    private listenCampaignSelectedExampleWithSwitchMap() {
        var campaignSelected$ = this.store.select(store => store.appDb.uiState.campaign.campaignSelected)
        var campaignsList$ = this.store.select(store => store.msDatabase.sdk.table_campaigns);
        return campaignSelected$.switchMap(i_campaignList => campaignsList$, (campaignId, campaigns) => {
            return campaigns.find((i_campaign: CampaignsModelExt) => {
                return i_campaign.getCampaignId() == campaignId;
            });
        })
    }

    private listenCampaignSelectedExampleFurtherLatestFromSelections() {
        var campaignSelected$ = this.store.select(
            store => store.appDb.uiState.campaign.campaignSelected
        );
        var boards$ = this.store.select(
            store => store.msDatabase.sdk.table_boards
        );
        var campaignsList$ = this.store.select(
            store => store.msDatabase.sdk.table_campaigns
        );
        return campaignSelected$.withLatestFrom(
            campaignsList$,
            (campaignId, campaigns) => {
                return campaigns.find((i_campaign: CampaignsModelExt) => {
                    return i_campaign.getCampaignId() == campaignId;
                });
            }).withLatestFrom(
            boards$,
            (campaign: CampaignsModelExt, boards: List<BoardsModel>) => {
                console.log(boards);
                return campaign;
            });
    }

    private findCampaignByIdTest(i_campaignId: number): Observable<CampaignsModelExt> {
        return this.store.select(store => store.msDatabase.sdk.table_campaigns)
            .take(1)
            .map((i_campaigns: List<CampaignsModelExt>) => {
                // console.log('look up campaign ' + i_campaignId);
                return i_campaigns.find((i_campaign: CampaignsModelExt) => {
                    return i_campaign.getCampaignId() == i_campaignId;
                });
            });
    }

    private findCampaignByIdConcatTemp1(i_campaignId): Observable<CampaignsModelExt> {
        var campaign1$ = this.findCampaignByIdTest(i_campaignId)
        var campaign2$ = this.findCampaignByIdTest(1)
        var campaign3$ = this.findCampaignByIdTest(2)

        return campaign1$.concatMap((x: CampaignsModelExt) => {
            return campaign2$;
        }, (a: CampaignsModelExt, b: CampaignsModelExt) => {
            return a;
        }).concatMap((campaignsModel: CampaignsModelExt) => {
            return this.findCampaignByIdTest(campaignsModel.getCampaignId())
        }, (c: CampaignsModelExt, d: CampaignsModelExt) => {
            console.log(c, d);
            return d;
        }).concatMap((campaignsModel: CampaignsModelExt) => this.findCampaignByIdTest(campaignsModel.getCampaignId()), (e: CampaignsModelExt, f: CampaignsModelExt) => {
            console.log(e, f);
            return e
        }).take(1)
    }

    private listenCampaignSelectedTemp2(): any {
        return this.store.select(store => store.appDb.uiState.campaign.campaignSelected);
    }

    private listenCampaignSelectedTemp3(): Observable<CampaignsModelExt> {

        var campaignSelected$ = this.store.select(store => store.appDb.uiState.campaign.campaignSelected)
        var campaigns$ = this.store.select(store => store.msDatabase.sdk.table_campaigns);

        return campaignSelected$.combineLatest(campaigns$, (campaignId: number, campaigns: List<CampaignsModelExt>) => {
            return campaigns.find((i_campaign: CampaignsModelExt) => {
                return i_campaign.getCampaignId() == campaignId;
            });
        })
    }
}
