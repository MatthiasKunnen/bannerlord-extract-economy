using System.Collections.Generic;
using TaleWorlds.CampaignSystem;
using TaleWorlds.CampaignSystem.Election;
using TaleWorlds.Library;

namespace EconomyExtractor {
    public class NoFiefElectionCampaignBehavior : CampaignBehaviorBase {
        public override void RegisterEvents() {
            CampaignEvents.HourlyTickEvent.AddNonSerializedListener(this, this.CancelPlayerFiefElections);
        }


        private void CancelPlayerFiefElections() {
            if (!Hero.MainHero.IsFactionLeader) {
                return;
            }

            Kingdom kingdom = Hero.MainHero.Clan.Kingdom;

            if (kingdom == null) {
                return;
            }

            var decisionsToRemove = new List<KingdomDecision>();

            foreach (var unresolvedDecision in kingdom.UnresolvedDecisions) {
                if (!(unresolvedDecision is SettlementClaimantDecision claimantDecision)) {
                    continue;
                }

                string settlementName = claimantDecision.Settlement.GetName().ToString();
                claimantDecision.Settlement.Town.IsOwnerUnassigned = false;
                decisionsToRemove.Add(claimantDecision);
                InformationManager.DisplayMessage(new InformationMessage($"Owner election of {settlementName} cancelled."));
            }

            foreach (var kingdomDecision in decisionsToRemove) {
                kingdom.RemoveDecision(kingdomDecision);
            }
        }


        public override void SyncData(IDataStore dataStore) {
        }
    }
}
