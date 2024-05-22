import * as basic from 'pixel_combats/basic';
import * as room from 'pixel_combats/room';
import * as teams from './default_teams.js';

const EndOfMatchTime = 3;

const GameStateValue = "Game";
const EndOfMatchStateValue = "EndOfMatch";
const EndAreaTag = "parcourend";
const EndTriggerPoints = 1000;
const CurSpawnPropName = "CurSpawn";
const ViewEndParameterName = "ViewEnd";
const LeaderBoardProp = "Leader";

const mainTimer = room.Timers.GetContext().Get("Main");
var endAreas = room.AreaService.GetByTag(EndAreaTag);
const stateProp = room.Properties.GetContext().Get("State");
const inventory = room.Inventory.GetContext();
const gnmeEndAreaColor = new basic.Color(0, 0, 1, 0);

inventory.Main.Value = false;
inventory.Secondary.Value = false;
inventory.Melee.Value = false;
inventory.Explosive.Value = false;
inventory.Build.Value = false;

const blueTeam = teams.create_team_blue();
blueTeam.Spawns.RespawnTime.Value = 0;

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


endTrigger.Tags = [EndAreaTag];
endTrigger.Enable = true;
endTrigger.OnEnter.Add(function (player) {
	endTrigger.Enable = false;
	player.Properties.Get(LeaderBoardProp).Value += 1000;
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
