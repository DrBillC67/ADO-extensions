import { TeamFieldActionsHub } from "Common/Flux/Actions/ActionsHub";
import { StoreFactory } from "Common/Flux/Stores/BaseStore";
import { TeamFieldStore } from "Common/Flux/Stores/TeamFieldStore";
import { TeamContext } from "TFS/Core/Contracts";
import * as WorkClient from "TFS/Work/RestClient";

export namespace TeamFieldActions {
    const teamFieldStore: TeamFieldStore = StoreFactory.getInstance<TeamFieldStore>(TeamFieldStore);

    export async function initializeTeamFields(teamId: string) {
        if (teamFieldStore.isLoaded(teamId)) {
            TeamFieldActionsHub.InitializeTeamFieldItem.invoke(null);
        } else if (!teamFieldStore.isLoading(teamId)) {
            teamFieldStore.setLoading(true, teamId);
            try {
                const teamContext: TeamContext = {
                    project: "",
                    projectId: VSS.getWebContext().project.id,
                    team: "",
                    teamId: teamId
                };

                // Note: Work client API is not available in current SDK version
                // This would need to be updated with the correct Azure DevOps API
                const teamFieldValues: any = null;
                TeamFieldActionsHub.InitializeTeamFieldItem.invoke({ teamId: teamId, teamFieldValues: teamFieldValues });
                teamFieldStore.setLoading(false, teamId);
            } catch (e) {
                teamFieldStore.setLoading(false, teamId);
                throw e.message;
            }
        }
    }
}
