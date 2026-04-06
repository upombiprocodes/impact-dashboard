package com.groupa11.impactdashboard.config;

import com.groupa11.impactdashboard.model.*;
import com.groupa11.impactdashboard.repository.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import java.io.InputStream;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final DashboardSummaryRepository summaryRepo;
    private final WeeklyDataRepository weeklyDataRepo;
    private final BadgeRepository badgeRepo;
    private final MonthlyGoalRepository goalRepo;
    private final EmittedDataRepository emittedRepo;
    private final SavedItemRepository savedItemRepo;
    private final StreakDayRepository streakDayRepo;
    private final ContributionRepository contributionRepo;
    private final ImpactDetailRepository impactDetailRepo;
    private final FoodRepository foodRepo;
    private final ChallengeRepository challengeRepo;

    public DataSeeder(DashboardSummaryRepository summaryRepo,
                      WeeklyDataRepository weeklyDataRepo,
                      BadgeRepository badgeRepo,
                      MonthlyGoalRepository goalRepo,
                      EmittedDataRepository emittedRepo,
                      SavedItemRepository savedItemRepo,
                      StreakDayRepository streakDayRepo,
                      ContributionRepository contributionRepo,
                      ImpactDetailRepository impactDetailRepo,
                      FoodRepository foodRepo,
                      ChallengeRepository challengeRepo) {
        this.summaryRepo = summaryRepo;
        this.weeklyDataRepo = weeklyDataRepo;
        this.badgeRepo = badgeRepo;
        this.goalRepo = goalRepo;
        this.emittedRepo = emittedRepo;
        this.savedItemRepo = savedItemRepo;
        this.streakDayRepo = streakDayRepo;
        this.contributionRepo = contributionRepo;
        this.impactDetailRepo = impactDetailRepo;
        this.foodRepo = foodRepo;
        this.challengeRepo = challengeRepo;
    }

    @Override
    public void run(String... args) {
        // Challenges (Seed this even if summary exists, in case we just added this feature)
        try {
            if (challengeRepo.count() == 0) {
                ObjectMapper mapper = new ObjectMapper();
                TypeReference<List<Challenge>> typeReference = new TypeReference<List<Challenge>>(){};
                InputStream inputStream = new ClassPathResource("challenges.json").getInputStream();
                List<Challenge> challenges = mapper.readValue(inputStream, typeReference);
                challengeRepo.saveAll(challenges);
                System.out.println("Challenges saved!");
            }
        } catch (Exception e) {
            System.out.println("Unable to save challenges: " + e.getMessage());
        }

        // Only seed the rest if database is empty (file-based H2 persists)
        if (summaryRepo.count() > 0) {
            System.out.println("Database already initialized.");
            return;
        }

        System.out.println("Initializing database...");

        // Dashboard Summary
        summaryRepo.save(new DashboardSummary(25, 32, 47, 5, 6, -6.5));

        // Weekly Data (global)
        weeklyDataRepo.save(new WeeklyData("W1", 48, 10, 57));
        weeklyDataRepo.save(new WeeklyData("W2", 46, 12, 57));
        weeklyDataRepo.save(new WeeklyData("W3", 45, 12, 57));
        weeklyDataRepo.save(new WeeklyData("W4", 42, 15, 57));
        weeklyDataRepo.save(new WeeklyData("W5", 38, 19, 57));
        weeklyDataRepo.save(new WeeklyData("W6", 41, 16, 57));
        weeklyDataRepo.save(new WeeklyData("W7", 35, 22, 57));
        weeklyDataRepo.save(new WeeklyData("W8", 33, 24, 57));
        weeklyDataRepo.save(new WeeklyData("W9", 31, 26, 57));
        weeklyDataRepo.save(new WeeklyData("W10", 29, 28, 57));
        weeklyDataRepo.save(new WeeklyData("W11", 27, 30, 57));
        weeklyDataRepo.save(new WeeklyData("W12", 25, 32, 57));

        // Badges
        badgeRepo.save(new Badge("First Week", "\uD83C\uDF31", true, "Logged your first week"));
        badgeRepo.save(new Badge("Beef-Free", "\uD83E\uDD57", true, "7 days without beef"));
        badgeRepo.save(new Badge("Hot Streak", "\uD83D\uDD25", true, "30-day logging streak"));
        badgeRepo.save(new Badge("Carbon Crusher", "\uD83D\uDCAA", true, "Saved 100kg CO\u2082"));
        badgeRepo.save(new Badge("Plant Pioneer", "\uD83C\uDF3F", true, "Save 200kg CO\u2082"));
        badgeRepo.save(new Badge("Climate Champ", "\uD83C\uDFC6", false, "90-day streak"));

        // Monthly Goal
        goalRepo.save(new MonthlyGoal(100, 94, 9));

        // Emitted Data
        emittedRepo.save(new EmittedData("M", 4));
        emittedRepo.save(new EmittedData("T", 3));
        emittedRepo.save(new EmittedData("W", 5));
        emittedRepo.save(new EmittedData("T", 3));
        emittedRepo.save(new EmittedData("F", 4));
        emittedRepo.save(new EmittedData("S", 2));
        emittedRepo.save(new EmittedData("S", 2));

        // Saved Items
        savedItemRepo.save(new SavedItem("Bike", "4kg"));
        savedItemRepo.save(new SavedItem("Veg", "2kg"));
        savedItemRepo.save(new SavedItem("Cold", "1kg"));

        // Streak Days (28 days)
        for (int i = 0; i < 28; i++) {
            streakDayRepo.save(new StreakDay(i, i <= 20));
        }

        // Contributions
        contributionRepo.save(new Contribution("Today", "+2.5kg"));
        contributionRepo.save(new Contribution("Yesterday", "+4.1kg"));
        contributionRepo.save(new Contribution("Nov 18", "+3.2kg"));

        // Impact Details
        impactDetailRepo.save(new ImpactDetail("Water", "420L"));
        impactDetailRepo.save(new ImpactDetail("Land", "12m\u00B2"));

        // Foods (20 items)
        foodRepo.save(new Food("Beef steak", "Meat", false, 26, 27.0, "F", "Brazil", "Very high emissions due to methane and land use."));
        foodRepo.save(new Food("Chicken breast", "Meat", false, 31, 6.9, "D", "UK", "Lower footprint than beef but still higher than plant-based."));
        foodRepo.save(new Food("Lentils (dry)", "Legumes", true, 25, 0.9, "A", "Canada", "Low emissions and high in protein."));
        foodRepo.save(new Food("Salmon fillet", "Fish", false, 20, 4.6, "C", "Norway", "Moderate emissions; fishing method affects footprint."));
        foodRepo.save(new Food("Tofu", "Plant-based", true, 8, 1.6, "A", "China", "Very low emissions and good plant protein source."));
        foodRepo.save(new Food("Cheddar cheese", "Dairy", false, 25, 8.5, "E", "UK", "Dairy has high footprint due to methane."));
        foodRepo.save(new Food("Eggs", "Dairy", false, 13, 4.5, "C", "UK", "Moderate emissions, good protein source."));
        foodRepo.save(new Food("Rice (white)", "Grains", true, 7, 2.7, "B", "India", "Methane from paddy fields contributes to emissions."));
        foodRepo.save(new Food("Chickpeas", "Legumes", true, 19, 0.8, "A", "Turkey", "Excellent low-carbon protein source."));
        foodRepo.save(new Food("Lamb chop", "Meat", false, 25, 24.0, "F", "New Zealand", "High emissions similar to beef."));
        foodRepo.save(new Food("Pork chop", "Meat", false, 27, 7.2, "D", "Denmark", "Lower than beef but significant footprint."));
        foodRepo.save(new Food("Milk (whole)", "Dairy", false, 3.4, 1.9, "B", "UK", "Moderate emissions per serving."));
        foodRepo.save(new Food("Almonds", "Nuts", true, 21, 2.3, "B", "USA", "Water-intensive but low carbon."));
        foodRepo.save(new Food("Broccoli", "Vegetables", true, 2.8, 0.4, "A", "UK", "Very low emissions, nutrient dense."));
        foodRepo.save(new Food("Potatoes", "Vegetables", true, 2, 0.3, "A", "UK", "One of the lowest carbon foods."));
        foodRepo.save(new Food("Banana", "Fruits", true, 1.1, 0.7, "A", "Ecuador", "Low emissions despite transport."));
        foodRepo.save(new Food("Avocado", "Fruits", true, 2, 1.3, "B", "Mexico", "Water-intensive but moderate carbon."));
        foodRepo.save(new Food("Pasta (dry)", "Grains", true, 13, 1.2, "A", "Italy", "Low carbon staple food."));
        foodRepo.save(new Food("Bread (white)", "Grains", true, 9, 0.8, "A", "UK", "Low emissions, daily staple."));
        foodRepo.save(new Food("Tuna (canned)", "Fish", false, 26, 3.1, "B", "Thailand", "Lower than fresh fish, good protein."));

        System.out.println("Database initialized successfully.");
    }
}
