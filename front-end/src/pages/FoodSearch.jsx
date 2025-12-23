import React, { useEffect, useMemo, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

function getRatingColor(rating) {
    if (rating === "A" || rating === "B") return "#10B981";
    if (rating === "C" || rating === "D") return "#EAB308";
    return "#EF4444";
}

export default function FoodSearch() {
    const [query, setQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [vegFilter, setVegFilter] = useState("all");
    const [selectedFood, setSelectedFood] = useState(null);
    const [foods, setFoods] = useState([]);
    const [categories, setCategories] = useState(["all"]);
    const [loading, setLoading] = useState(true);
    const [logQuantity, setLogQuantity] = useState(100);
    const [logMessage, setLogMessage] = useState(null);

    // Fetch foods from backend
    useEffect(() => {
        const fetchFoods = async () => {
            try {
                const response = await fetch(`${API_URL}/foods`);
                const data = await response.json();
                // Transform backend format to frontend format
                const transformedFoods = data.map(f => ({
                    id: f.id,
                    name: f.name,
                    category: f.category,
                    isVeg: f.is_veg,
                    protein: f.protein,
                    co2Per100g: f.co2_per_100g,
                    rating: f.rating,
                    origin: f.origin,
                    notes: f.notes
                }));
                setFoods(transformedFoods);
                
                // Extract unique categories
                const uniqueCategories = [...new Set(data.map(f => f.category))];
                setCategories(["all", ...uniqueCategories]);
                
                setLoading(false);
            } catch (error) {
                console.error("Error fetching foods:", error);
                setLoading(false);
            }
        };
        fetchFoods();
    }, []);

    // Log food consumption
    const handleLogFood = async (food) => {
        try {
            const response = await fetch(`${API_URL}/log-food`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    food_id: food.id,
                    quantity_grams: logQuantity
                })
            });
            const result = await response.json();
            setLogMessage(`Logged ${result.food_name}: ${result.co2_impact}kg CO₂`);
            setTimeout(() => setLogMessage(null), 3000);
        } catch (error) {
            console.error("Error logging food:", error);
            setLogMessage("Failed to log food");
        }
    };

    const filteredFoods = useMemo(() => {
        return foods.filter((food) => {
            const matchesQuery =
                food.name.toLowerCase().includes(query.toLowerCase());

            const matchesCategory =
                categoryFilter === "all" || food.category === categoryFilter;

            const matchesVeg =
                vegFilter === "all" ||
                (vegFilter === "veg" && food.isVeg) ||
                (vegFilter === "non-veg" && !food.isVeg);

            return matchesQuery && matchesCategory && matchesVeg;
        });
    }, [query, categoryFilter, vegFilter]);

    const currentFood =
        selectedFood && filteredFoods.find((f) => f.id === selectedFood.id)
            ? selectedFood
            : filteredFoods[0] || null;

    return (
        <div style={styles.page}>
            <h1 style={styles.title}>Explore Foods</h1>

            <div style={styles.searchCard}>
                <div style={styles.searchBar}>
                    <span style={styles.icon}>🔍</span>
                    <input
                        type="text"
                        placeholder="Search for a food…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={styles.input}
                    />
                </div>

                <div style={styles.filtersRow}>
                    <div style={styles.filterGroup}>
                        <label style={styles.filterLabel}>Category</label>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            style={styles.select}
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat === "all" ? "All categories" : cat}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={styles.filterGroup}>
                        <label style={styles.filterLabel}>Veg / Non-veg</label>
                        <select
                            value={vegFilter}
                            onChange={(e) => setVegFilter(e.target.value)}
                            style={styles.select}
                        >
                            <option value="all">All</option>
                            <option value="veg">Vegetarian</option>
                            <option value="non-veg">Non-veg</option>
                        </select>
                    </div>
                </div>
            </div>

            <div style={styles.grid}>
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>Results</h2>

                    {filteredFoods.length === 0 ? (
                        <p style={styles.muted}>No foods found.</p>
                    ) : (
                        <div style={styles.list}>
                            {filteredFoods.map((food) => (
                                <button
                                    key={food.id}
                                    onClick={() => setSelectedFood(food)}
                                    style={{
                                        ...styles.item,
                                        borderColor:
                                            currentFood && currentFood.id === food.id
                                                ? "#10B981"
                                                : "#1F2937"
                                    }}
                                >
                                    <div>
                                        <div style={styles.foodRow}>
                                            <span style={styles.foodName}>{food.name}</span>

                                            <span
                                                style={{
                                                    ...styles.ratingBadge,
                                                    backgroundColor: getRatingColor(food.rating) + "20",
                                                    color: getRatingColor(food.rating),
                                                    borderColor: getRatingColor(food.rating)
                                                }}
                                            >
                                                {food.rating}
                                            </span>
                                        </div>

                                        <div style={styles.metaRow}>
                                            <span>{food.category}</span>
                                            <span style={styles.dot}>•</span>
                                            <span>{food.isVeg ? "Veg" : "Non-veg"}</span>
                                        </div>
                                    </div>

                                    <div style={{ textAlign: "right" }}>
                                        <div style={styles.co2Value}>
                                            {food.co2Per100g.toFixed(1)} kg
                                        </div>
                                        <div style={styles.co2Label}>per 100g CO₂e</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>Details</h2>

                    {loading ? (
                        <p style={styles.muted}>Loading foods...</p>
                    ) : !currentFood ? (
                        <p style={styles.muted}>Select a food for more info.</p>
                    ) : (
                        <div style={styles.detailBody}>
                            <h3 style={styles.detailName}>{currentFood.name}</h3>

                            <div style={styles.detailGrid}>
                                <div>
                                    <div style={styles.label}>Category</div>
                                    <div style={styles.value}>{currentFood.category}</div>
                                </div>

                                <div>
                                    <div style={styles.label}>Protein</div>
                                    <div style={styles.value}>
                                        {currentFood.protein} g / 100g
                                    </div>
                                </div>

                                <div>
                                    <div style={styles.label}>CO₂ per 100g</div>
                                    <div style={styles.value}>
                                        {currentFood.co2Per100g.toFixed(1)} kg
                                    </div>
                                </div>

                                <div>
                                    <div style={styles.label}>Veg / Non-veg</div>
                                    <div style={styles.value}>
                                        {currentFood.isVeg ? "Veg" : "Non-veg"}
                                    </div>
                                </div>

                                <div>
                                    <div style={styles.label}>Origin</div>
                                    <div style={styles.value}>{currentFood.origin}</div>
                                </div>
                            </div>

                            <div style={styles.notesBox}>
                                <div style={styles.label}>Notes</div>
                                <p style={styles.notes}>{currentFood.notes}</p>
                            </div>

                            {/* Log Food Section */}
                            <div style={styles.logSection}>
                                <div style={styles.label}>Log Consumption</div>
                                <div style={styles.logRow}>
                                    <input
                                        type="number"
                                        value={logQuantity}
                                        onChange={(e) => setLogQuantity(Number(e.target.value))}
                                        style={styles.quantityInput}
                                        min="1"
                                    />
                                    <span style={styles.gramLabel}>grams</span>
                                    <button
                                        onClick={() => handleLogFood(currentFood)}
                                        style={styles.logButton}
                                    >
                                        Log Food
                                    </button>
                                </div>
                                <p style={styles.impactPreview}>
                                    Impact: {((currentFood.co2Per100g * logQuantity) / 100).toFixed(2)} kg CO₂
                                </p>
                                {logMessage && (
                                    <p style={styles.logMessage}>{logMessage}</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: {
        padding: "24px",
        maxWidth: "1200px",
        margin: "0 auto",
        color: "#F9FAFB"
    },
    title: {
        fontSize: "28px",
        fontWeight: "700",
        color: "#020617",
        marginBottom: "20px"
    },
    searchCard: {
        backgroundColor: "#111827",
        padding: "16px",
        borderRadius: "16px",
        border: "1px solid #1F2937",
        marginBottom: "20px"
    },
    searchBar: {
        display: "flex",
        alignItems: "center",
        backgroundColor: "#020617",
        borderRadius: "999px",
        padding: "8px 14px",
        border: "1px solid #1F2937"
    },
    icon: {
        marginRight: "8px"
    },
    input: {
        flex: 1,
        background: "transparent",
        border: "none",
        outline: "none",
        color: "#F9FAFB"
    },
    filtersRow: {
        display: "flex",
        gap: "20px",
        marginTop: "16px"
    },
    filterGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        minWidth: "180px"
    },
    filterLabel: {
        fontSize: "12px",
        textTransform: "uppercase",
        opacity: 0.8
    },
    select: {
        backgroundColor: "#020617",
        borderRadius: "8px",
        border: "1px solid #1F2937",
        padding: "8px 12px",
        color: "#F9FAFB",
        outline: "none"
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "1.2fr 1fr",
        gap: "20px"
    },
    card: {
        backgroundColor: "#111827",
        padding: "20px",
        borderRadius: "16px",
        border: "1px solid #1F2937"
    },
    cardTitle: {
        fontSize: "18px",
        fontWeight: "600",
        marginBottom: "12px"
    },
    list: {
        display: "flex",
        flexDirection: "column",
        gap: "8px"
    },
    item: {
        padding: "12px",
        display: "flex",
        justifyContent: "space-between",
        borderRadius: "12px",
        border: "1px solid #1F2937",
        backgroundColor: "#020617",
        cursor: "pointer",
        color: "#F9FAFB"
    },
    foodRow: {
        display: "flex",
        alignItems: "center",
        gap: "8px"
    },
    foodName: {
        fontSize: "14px",
        fontWeight: "600"
    },
    ratingBadge: {
        padding: "2px 8px",
        borderRadius: "8px",
        border: "1px solid #4B5563",
        fontSize: "12px",
        fontWeight: "600"
    },
    metaRow: {
        display: "flex",
        gap: "6px",
        fontSize: "12px",
        opacity: 0.8
    },
    dot: {
        opacity: 0.5
    },
    co2Value: {
        fontWeight: "700"
    },
    co2Label: {
        fontSize: "11px",
        opacity: 0.7
    },
    muted: {
        opacity: 0.8
    },
    detailBody: {
        marginTop: "10px"
    },
    detailName: {
        fontSize: "18px",
        fontWeight: "700",
        marginBottom: "14px"
    },
    detailGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "12px",
        marginBottom: "14px"
    },
    label: {
        fontSize: "11px",
        opacity: 0.7
    },
    value: {
        fontSize: "14px",
        fontWeight: "500"
    },
    notesBox: {
        backgroundColor: "#020617",
        borderRadius: "12px",
        border: "1px solid #1F2937",
        padding: "12px"
    },
    notes: {
        margin: 0,
        opacity: 0.9
    },
    logSection: {
        marginTop: "16px",
        padding: "16px",
        backgroundColor: "#020617",
        borderRadius: "12px",
        border: "1px solid #1F2937"
    },
    logRow: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginTop: "8px"
    },
    quantityInput: {
        width: "80px",
        padding: "8px 12px",
        borderRadius: "8px",
        border: "1px solid #1F2937",
        backgroundColor: "#111827",
        color: "#F9FAFB",
        fontSize: "14px",
        outline: "none"
    },
    gramLabel: {
        fontSize: "14px",
        opacity: 0.8
    },
    logButton: {
        padding: "8px 20px",
        borderRadius: "8px",
        border: "none",
        backgroundColor: "#10B981",
        color: "#fff",
        fontWeight: "600",
        cursor: "pointer",
        transition: "background-color 0.2s"
    },
    impactPreview: {
        marginTop: "10px",
        fontSize: "13px",
        opacity: 0.8
    },
    logMessage: {
        marginTop: "8px",
        padding: "8px 12px",
        borderRadius: "8px",
        backgroundColor: "#064E3B",
        color: "#10B981",
        fontSize: "13px"
    }
};
