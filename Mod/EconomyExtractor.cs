using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Windows.Forms;
using TaleWorlds.CampaignSystem;
using TaleWorlds.CampaignSystem.GameMenus;
using TaleWorlds.Core;
using static TaleWorlds.Core.ItemObject;

namespace EconomyExtractor {

    public class EconomyExtractor : CampaignBehaviorBase {

        public override void RegisterEvents() {
            CampaignEvents.OnSessionLaunchedEvent.AddNonSerializedListener(this, OnSessionLaunched);
        }

        public override void SyncData(IDataStore dataStore) {

        }

        private void OnSessionLaunched(CampaignGameStarter gameStarter) {
            string[] menusToAppend = { "town", "village" };
            foreach (var menuId in menusToAppend) {
                try {
                    gameStarter.AddGameMenuOption(
                        menuId: menuId,
                        optionId: $"ExtractEconomyOption{menuId}",
                        optionText: "Extract economy",
                        condition: (MenuCallbackArgs args) => {
                            args.optionLeaveType = GameMenuOption.LeaveType.Trade;
                            return true;
                        },
                        consequence: (MenuCallbackArgs args) => {
                            try {
                                ExtractEconomy();
                            } catch (Exception ex) {
                                MessageBox.Show($"Exception occured while extracing economy.\n\n{ExceptionHandler.ToString(ex)}");
                            }
                        },
                        isLeave: true,
                        index: -1,
                        isRepeatable: false);
                } catch (Exception ex) {
                    MessageBox.Show($"Exception occured while trying to add menu option {menuId}.\n\n{ExceptionHandler.ToString(ex)}");
                }
            }
        }

        private void ExtractEconomy() {
            var items = Items.All.Where(item => {
                return item.Type == ItemTypeEnum.Horse || item.Type == ItemTypeEnum.Goods;
            });
            var export = new Dictionary<string, SettlementEconomy>();

            var settlementsWithMarkets = Village.All.Concat<SettlementComponent>(Town.AllTowns);

            foreach (var settlement in settlementsWithMarkets) {
                var settlementEconomy = new SettlementEconomy() {
                    Type = settlement.GetType().Name,
                };

                foreach (var item in items) {
                    if (settlementEconomy.Goods.ContainsKey(item.Name.ToString())) {
                        // Horses appear multiple times in the items list
                        continue;
                    }

                    var itemEconomy = new ItemEconomy() {
                        BuyPrice = settlement.GetItemPrice(
                            item: item,
                            tradingParty: MobileParty.MainParty,
                            isSelling: false),
                        SellPrice = settlement.GetItemPrice(
                            item: item,
                            tradingParty: MobileParty.MainParty,
                            isSelling: true),
                    };

                    if (settlement is Town town) {
                        itemEconomy.Demand = town.MarketData.GetDemand(item.ItemCategory);
                        itemEconomy.Supply = town.MarketData.GetSupply(item.ItemCategory);
                    }

                    settlementEconomy.Goods.Add(item.Name.ToString(), itemEconomy);
                }

                export.Add(settlement.Name.ToString(), settlementEconomy);
            }

            ExportEconomy(export);
        }

        private void ExportEconomy(Dictionary<string, SettlementEconomy> data) {
            try {
                var path = Path.Combine(Path.GetTempPath(), "Bannerlord-economy.json"); ;
                File.WriteAllText(path, JsonConvert.SerializeObject(data, Formatting.Indented));
                InformationManager.DisplayMessage(new InformationMessage($"Economy exported to {path}"));
            } catch (Exception ex) {
                MessageBox.Show($"Error exporting economy to file.\n\n{ExceptionHandler.ToString(ex)}");
            }
        }
    }
}
