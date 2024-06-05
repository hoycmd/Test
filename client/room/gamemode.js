import * as basic from 'pixel_combats/basic';
import * as room from 'pixel_combats/room';
import * as teams from './default_teams.js';

const EndAreaTag = "EndAreaTag";
const ViewEnd = "ViewEnd";

var endAreas = room.AreaService.GetByTag(EndAreaTag);
const gnmeEndAreaColor = new basic.Color(0, 0, 1, 0);

const blueTeam = teams.create_team_blue();

var endView = room.AreaViewService.GetContext().Get("EndView");
endView.Color = gnmeEndAreaColor;
endView.Tags = [EndAreaTag];
endView.Enable = true;

const endTrigger = room.AreaPlayerTriggerService.Get("EndTrigger");
endTrigger.Tags = [EndAreaTag];
endTrigger.Enable = true;
endTrigger.OnEnter.Add(function (player) {
	player.Ui.Hint.Value = "Da";
});

room.Teams.OnRequestJoinTeam.Add(function (player, team) { team.Add(player); });
room.Teams.OnPlayerChangeTeam.Add(function (player) { player.Spawns.Spawn() });

room.Map.OnLoad.Add(InitializeMap);
function InitializeMap() {
	endAreas = room.AreaService.GetByTag(EndAreaTag);
}

InitializeMap();
