using TaleWorlds.CampaignSystem;
using TaleWorlds.Core;
using TaleWorlds.Localization;
using TaleWorlds.MountAndBlade;

namespace EconomyExtractor {
    public class Main : MBSubModuleBase {

        protected override void OnGameStart(Game game, IGameStarter gameStarterObject) {
            base.OnGameStart(game, gameStarterObject);

            if (gameStarterObject is CampaignGameStarter campaignGameStarter) {
                campaignGameStarter.AddBehavior(new EconomyExtractor());
            }
        }
    }
}
