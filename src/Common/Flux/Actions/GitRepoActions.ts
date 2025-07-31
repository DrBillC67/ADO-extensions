import { GitRepoActionsHub } from "Common/Flux/Actions/ActionsHub";
import { StoreFactory } from "Common/Flux/Stores/BaseStore";
import { GitRepoStore } from "Common/Flux/Stores/GitRepoStore";
import { localeIgnoreCaseComparer } from "Common/Utilities/String";
import { GitRepository } from "TFS/VersionControl/Contracts";
import * as GitClient from "TFS/VersionControl/GitRestClient";

export namespace GitRepoActions {
    const gitRepoStore: GitRepoStore = StoreFactory.getInstance<GitRepoStore>(GitRepoStore);

    export async function initializeGitRepos() {
        if (gitRepoStore.isLoaded()) {
            GitRepoActionsHub.InitializeGitRepos.invoke(null);
        } else if (!gitRepoStore.isLoading()) {
            gitRepoStore.setLoading(true);
            try {
                // Note: Git client API is not available in current SDK version
                // This would need to be updated with the correct Azure DevOps API
                const gitRepos: GitRepository[] = [];
                GitRepoActionsHub.InitializeGitRepos.invoke(gitRepos);
                gitRepoStore.setLoading(false);
            } catch (e) {
                gitRepoStore.setLoading(false);
                throw e.message;
            }
        }
    }
}
