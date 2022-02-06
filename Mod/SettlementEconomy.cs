using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EconomyExtractor {

    class ItemEconomy {

        public int BuyPrice { get; set; }

        public int SellPrice { get; set; }

        public float? Demand { get; set; }

        public float? Supply { get; set; }
    }

    class SettlementEconomy {

        public Dictionary<string, ItemEconomy> Goods { get; } = new Dictionary<string, ItemEconomy>();

        public string Type { get; set; }
    }
}
