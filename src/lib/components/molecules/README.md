# Company Dashboard Components

Componenti molecolari per la pagina di dettaglio dell'azienda, seguendo le best practice di Svelte 5.

## Struttura

### CompanyHeader
Intestazione della pagina con nome azienda, tipo di produzione, regione e valore stimato.

**Props:**
- `companyName: string` - Nome dell'azienda
- `itemCode: string` - Codice dell'articolo prodotto
- `regionName: string` - Nome della regione
- `estimatedValue: number` - Valore stimato dell'azienda

### SummaryCards
Tre card di riepilogo: Production, Info, Market.

**Props:**
- `production: number` - Quantità attuale di produzione
- `productionCapacity: number` - Capacità di produzione in percentuale
- `productionValue: number` - Valore di mercato della produzione
- `item: any` - Dati dell'articolo
- `bestBuyPrice: number` - Miglior prezzo di acquisto
- `bestSellPrice: number` - Miglior prezzo di vendita
- `marketSpread: number` - Differenza tra buy e sell
- `workerCount: number` - Numero di lavoratori attivi

### CompanyPerformanceCard
Card con i bonus di performance, tasse, depositi e investimenti in cemento.

**Props:**
- `bonusLabels: { label: string; value: number }[]` - Array di bonus da visualizzare
- `countryTaxes: number` - Percentuale di tasse del paese
- `depositInfo: { startsAt: string | null; endsAt: string | null } | null` - Informazioni sul deposito
- `concreteInvested: number` - Quantità di cemento investito
- `concreteValue: number` - Valore del cemento investito

### UpgradesCard
Card con i dettagli degli upgrade (Engine e Storage).

**Props:**
- `engineLevel: number` - Livello attuale dell'engine
- `storageLevel: number` - Livello attuale dello storage
- `breakRoomLevel: number | undefined` - Livello attuale della break room
- `engineStats: UpgradeStats` - Statistiche dell'upgrade engine
- `storageStats: UpgradeStats` - Statistiche dell'upgrade storage

### BestRegionsTable
Tabella delle migliori regioni alternative per la produzione.

**Props:**
- `bonuses: any[]` - Array di bonus disponibili per le regioni
- `currentTotalBonus: number` - Bonus totale attuale
- `currentRegion: string` - ID della regione attuale
- `getCountryName: (regionId: string) => string` - Funzione per ottenere il nome del paese
- `getRegionName: (regionId: string) => string` - Funzione per ottenere il nome della regione

## Flusso dei dati

La pagina principale (+page.svelte) computa tutti i dati derivati e li passa ai componenti molecolari come props.
Questo mantiene i componenti semplici, reattivi e facili da testare.

```
+page.svelte
├── CompanyHeader
├── SummaryCards
└── Performance Grid
    ├── CompanyPerformanceCard
    ├── UpgradesCard
    └── BestRegionsTable
```

## Best Practice Applicate

- **Single Responsibility**: Ogni componente ha una responsabilità specifica
- **Props-driven**: I dati vengono passati tramite props, non direttamente da store
- **Svelte 5 Runes**: Utilizzo di `$derived` e `$props` per la reattività
- **Type Safety**: Interfacce TypeScript per le props
- **Composability**: Componenti piccoli e combinabili
