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

        private string _economyOutputPath;

        public override void RegisterEvents() {
            CampaignEvents.OnSessionLaunchedEvent.AddNonSerializedListener(this, OnSessionLaunched);
        }

        public override void SyncData(IDataStore dataStore) {

        }

        private void OnSessionLaunched(CampaignGameStarter gameStarter) {
            var dataFolder = Path.Combine(System.Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "bannerlord-economy-mod");
            Directory.CreateDirectory(dataFolder);
            this._economyOutputPath = Path.Combine(dataFolder, "economy-export.json");

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
                                MessageBox.Show($"Exception occured while extracting economy.\n\n{ExceptionHandler.ToString(ex)}");
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
            var items = Items.All
                .Where(item => item.Type == ItemTypeEnum.Animal
                               || item.Type == ItemTypeEnum.Goods
                               || item.Type == ItemTypeEnum.Horse)
                .ToList();
            var export = new Dictionary<string, ItemEconomy>();

            var settlementsWithMarkets = Village.All.Concat<SettlementComponent>(Town.AllTowns).ToList();

            foreach (var item in items) {
                var itemEconomy = new ItemEconomy() {
                    Type = item.Type.ToString(),
                };

                foreach (var settlement in settlementsWithMarkets) {
                    var settlementEconomy = new SettlementEconomy() {
                        BuyPrice = settlement.GetItemPrice(
                            item: item,
                            tradingParty: MobileParty.MainParty,
                            isSelling: false),
                        SellPrice = settlement.GetItemPrice(
                            item: item,
                            tradingParty: MobileParty.MainParty,
                            isSelling: true),
                        SettlementName = settlement.Name.ToString(),
                        SettlementType = settlement.GetType().Name
                    };

                    if (settlement is Town town) {
                        settlementEconomy.Demand = town.MarketData.GetDemand(item.ItemCategory);
                        settlementEconomy.Supply = town.MarketData.GetSupply(item.ItemCategory);
                    }

                    itemEconomy.Prices.Add(settlementEconomy);
                }

                if (!export.ContainsKey(item.Name.ToString())) {
                    // @todo Look into why duplicate horse names exist
                    export.Add(item.Name.ToString(), itemEconomy);
                }
            }

            ExportEconomy(export);
        }

        private void ExportEconomy(Dictionary<string, ItemEconomy> data) {
            try {
                File.WriteAllText(this._economyOutputPath, JsonConvert.SerializeObject(data, Formatting.Indented));
                InformationManager.DisplayMessage(new InformationMessage($"Economy exported to {this._economyOutputPath}"));
            } catch (Exception ex) {
                MessageBox.Show($"Error exporting economy to file.\n\n{ExceptionHandler.ToString(ex)}");
            }
        }
    }
}
