using TaleWorlds.CampaignSystem.ComponentInterfaces;
using TaleWorlds.CampaignSystem.Settlements;

namespace EconomyExtractor
{
    public class CustomDisguiseDetectionModel : DisguiseDetectionModel {
        public override float CalculateDisguiseDetectionProbability(Settlement settlement) {
            return 1f;
        }
    }
}
