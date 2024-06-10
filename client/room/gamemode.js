import * as basic from 'pixel_combats/basic';
import * as room from 'pixel_combats/room';
import * as teams from './default_teams.js';

const gnmeEndAreaColor = new basic.Color(0, 0, 1, 0);

const blueTeam = teams.create_team_blue();

var endView = room.AreaViewService.GetContext().Get("EndV");
endView.Color = gnmeEndAreaColor;
endView.Tags = ["EndAreaTag"];
endView.Enable = true;

const endTrigger = room.AreaPlayerTriggerService.Get("EndT");
endTrigger.Tags = ["EndAreaTag"];
endTrigger.Enable = true;

room.Teams.OnRequestJoinTeam.Add(function (player, team) { team.Add(player); });
room.Teams.OnPlayerChangeTeam.Add(function (player) { player.Spawns.Spawn() });
