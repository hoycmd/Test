import * as basic from 'pixel_combats/basic';
import * as room from 'pixel_combats/room';
import * as teams from './default_teams.js';

const EndOfMatchTime = 3;

const GameStateValue = "Game";
const EndOfMatchStateValue = "EndOfMatch";
const EndAreaTag = "parcourend";
const CurSpawnPropName = "CurSpawn";
const ViewEndParameterName = "ViewEnd";
const LeaderBoardProp = "Leader";

const mainTimer = room.Timers.GetContext().Get("Main");
var endAreas = room.AreaService.GetByTag(EndAreaTag);
const stateProp = room.Properties.GetContext().Get("State");
const gnmeEndAreaColor = new basic.Color(0, 0, 1, 0);

const blueTeam = teams.create_team_blue();

stateProp.OnValue.Add(OnState);
function OnState() {
	const spawnsRoomContext = room.Spawns.GetContext();
	switch (stateProp.Value) {
		case GameStateValue:
			spawnsRoomContext.enable = true;
			break;
		case EndOfMatchStateValue:
			spawnsRoomContext.enable = false;
			spawnsRoomContext.Despawn();
			room.Game.GameOver(room.LeaderBoard.GetPlayers());
			mainTimer.Restart(EndOfMatchTime);
			break;
	}
}

if (room.GameMode.Parameters.GetBool(ViewEndParameterName)) {
	var endView = room.AreaViewService.GetContext().Get("EndView");
	endView.Color = gnmeEndAreaColor;
	endView.Tags = [EndAreaTag];
	endView.Enable = true;
}

const endTrigger = room.AreaPlayerTriggerService.Get("EndTrigger");
endTrigger.Tags = [EndAreaTag];
endTrigger.Enable = true;
endTrigger.OnEnter.Add(function (player) {
	endTrigger.Enable = false;
	stateProp.Value = EndOfMatchStateValue;
});

mainTimer.OnTimer.Add(function () { Game.RestartGame(); });

room.LeaderBoard.PlayerLeaderBoardValues = [
	{
		Value: LeaderBoardProp,
		DisplayName: "Statistics/Scores",
		ShortDisplayName: "Statistics/ScoresShort"
	}
];
room.LeaderBoard.TeamLeaderBoardValue = {
	Value: LeaderBoardProp,
	DisplayName: "Statistics/Scores",
	ShortDisplayName: "Statistics/Scores"
};
room.LeaderBoard.PlayersWeightGetter.Set(function (player) {
	return player.Properties.Get(LeaderBoardProp).Value;
});

room.Teams.OnRequestJoinTeam.Add(function (player, team) { team.Add(player); });
room.Teams.OnPlayerChangeTeam.Add(function (player) { player.Spawns.Spawn() });

room.Map.OnLoad.Add(InitializeMap);
function InitializeMap() {
	endAreas = room.AreaService.GetByTag(EndAreaTag);
}

InitializeMap();

stateProp.Value = GameStateValue;
