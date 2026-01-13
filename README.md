# Chronos: The Interactive Time-Series Navigator

## Setup and Run Instructions

1. **Clone the repository:**
    ```bash
    git clone https://github.com/yashughade10/chronos-aion.git
    cd chronos-aion
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Run the development server:**
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:3000`.

---

## Design Choices & Architecture

### State Management
- **Zustand**: Global state for live sync toggle with localStorage persistence
- **TanStack Query**: Server state management with automatic caching, refetching, and conditional polling
- **Local Storage**: Search history and watchlist data

### Performance Optimizations
- **Request Cancellation**: AbortController prevents race conditions when rapidly switching between tabs
- **Memoization**: useMemo hooks avoid unnecessary recalculations in chart components

---

## Data Flow

1. User selects cryptocurrency
2. ID stored in localStorage (FIFO, max 5 items)
3. TanStack Query fetches data from CoinGecko API
4. AbortController cancels any pending requests
5. Charts render
6. If in watchlist, price monitoring begins
7. Threshold limit triggers toast alert
8. Live sync toggle controls polling interval (5s when active)

---

## API Integration

**Data Source**: CoinGecko API  
**Endpoints**:
- `/coins/markets` - List of cryptocurrencies
- `/coins/{id}/market_chart` - Historical price, volume, and market cap data

---

## Link to Deployed Application
[Chronos ](https://chronos-aion.vercel.app/)
