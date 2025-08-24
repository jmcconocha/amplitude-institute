# 🔧 Database View Templates & Setup Guide

*Step-by-step instructions for creating optimized database views*

---

## 🎯 **View Creation Workflow**

### **Step 1: Access Your Database**

1. Navigate to [The Amplitude Institute - Operations Hub](The%20Amplitude%20Institute%20-%20Operations%20Hub%2093b7756b133547b5827eb593a4146d28.md)
2. Click the dropdown arrow next to the default view
3. Select "+ Add a view"

### **Step 2: Choose View Type**

- 📋 **Table**: Best for detailed data analysis
- 📌 **Board**: Great for status tracking (Kanban style)
- 📅 **Calendar**: Perfect for timeline management
- 📊 **Gallery**: Visual document previews

---

## 🔥 **Priority View Templates**

### **🔴 Critical Priority Dashboard**

```yaml
View Name: "🔴 Critical Priority"
Type: Table
Filters:
  - Priority equals "Critical"
Sort:
  - Due Date (Ascending)
  - Last Updated (Descending)
Properties Shown:
  - Document Title
  - Status
  - Due Date
  - Key Stakeholders
  - Next Actions
  - Budget Estimate
```

### **📅 This Week's Focus**

```yaml
View Name: "📅 This Week"
Type: Board
Group By: Status
Filters:
  - Due Date is within next 7 days
  - OR Status equals "In Review"
Sort:
  - Priority (Critical first)
  - Due Date (Ascending)
Properties Shown:
  - Document Title
  - Priority
  - Due Date
  - Key Stakeholders
```

### **👨‍💼 Board Meeting Prep**

```yaml
View Name: "👨‍💼 Board Meeting"
Type: Table
Filters:
  - Confidentiality equals "Board Level" OR "Public"
  - Impact Level equals "Strategic"
  - Status equals "Complete" OR "In Review"
Sort:
  - Category
  - Priority
Properties Shown:
  - Document Title
  - Category
  - Status
  - Impact Level
  - Last Updated
```

---

## 👥 **Stakeholder-Specific Views**

### **⚖️ Legal Team Dashboard**

```yaml
View Name: "⚖️ Legal Team"
Type: Table
Filters:
  - Category equals "Legal & IP"
  - OR Key Stakeholders contains "Legal Team"
Sort:
  - Priority (Critical first)
  - Due Date (Ascending)
Properties Shown:
  - Document Title
  - Status
  - Priority
  - Due Date
  - Confidentiality
  - Next Actions
```

### **🔬 Engineering Focus**

```yaml
View Name: "🔬 Engineering"
Type: Board
Group By: Development Phase
Filters:
  - Key Stakeholders contains "Engineers"
  - OR Category equals "Implementation"
Sort:
  - Priority
  - Due Date
Properties Shown:
  - Document Title
  - Development Phase
  - Status
  - Budget Estimate
```

### **💰 Investor Relations**

```yaml
View Name: "💰 Investor Relations"
Type: Gallery
Filters:
  - Key Stakeholders contains "Funders"
  - OR Category equals "Funding & Finance"
  - Confidentiality not equal "Founders Only"
Sort:
  - Last Updated (Descending)
Properties Shown:
  - Document Title
  - Status
  - Development Phase
  - Impact Level
```

---

## 📊 **Status Tracking Views**

### **🔄 Active Work Queue**

```yaml
View Name: "🔄 Active Work"
Type: Board
Group By: Status
Filters:
  - Status equals "Draft" OR "In Review" OR "Needs Update"
Sort:
  - Priority
  - Due Date
Properties Shown:
  - Document Title
  - Priority
  - Due Date
  - Key Stakeholders
  - Next Actions
```

### **✅ Completed Archive**

```yaml
View Name: "✅ Completed"
Type: Table
Filters:
  - Status equals "Complete"
Sort:
  - Last Updated (Descending)
  - Category
Properties Shown:
  - Document Title
  - Category
  - Impact Level
  - Last Updated
  - Key Stakeholders
```

---

## 💰 **Budget & Resource Views**

### **💸 High Investment Items**

```yaml
View Name: "💸 High Investment"
Type: Table
Filters:
  - Budget Estimate equals "$10K - $50K" OR "$50K+"
Sort:
  - Budget Estimate (Custom: $50K+, $10K-$50K)
  - Priority
Properties Shown:
  - Document Title
  - Budget Estimate
  - Status
  - Impact Level
  - Key Stakeholders
```

### **🆓 Quick Wins**

```yaml
View Name: "🆓 Quick Wins"
Type: Board
Group By: Development Phase
Filters:
  - Budget Estimate equals "No Cost" OR "< $1K"
Sort:
  - Priority
  - Development Phase
Properties Shown:
  - Document Title
  - Status
  - Priority
  - Next Actions
```

---

## 📅 **Timeline Management Views**

### **📆 Monthly Roadmap**

```yaml
View Name: "📆 Monthly Roadmap"
Type: Calendar
Date Property: Due Date
Filters:
  - Due Date is within next 30 days
Properties Shown:
  - Document Title
  - Priority
  - Status
  - Category
```

### **🗓️ Quarterly Planning**

```yaml
View Name: "🗓️ Quarterly Plan"
Type: Timeline
Date Property: Due Date
Filters:
  - Due Date is within next 90 days
  - Impact Level equals "Strategic" OR "Operational"
Group By: Category
Properties Shown:
  - Document Title
  - Development Phase
  - Key Stakeholders
  - Impact Level
```

---

## 🎨 **Custom Combo Views**

### **🔥 CEO Dashboard**

```yaml
View Name: "🔥 CEO Dashboard"
Type: Table
Filters:
  - Priority equals "Critical" OR "High"
  - Impact Level equals "Strategic"
  - Status not equal "Draft"
Sort:
  - Priority (Critical first)
  - Due Date (Ascending)
Group By: Category
Properties Shown:
  - Document Title
  - Status
  - Due Date
  - Impact Level
  - Key Stakeholders
  - Next Actions
```

### **🎯 Sprint Planning**

```yaml
View Name: "🎯 Sprint Planning"
Type: Board
Group By: Development Phase
Filters:
  - Status equals "Planning" OR "Implementation"
  - Category equals "Implementation" OR "Core Strategy"
Sort:
  - Priority
  - Due Date
Properties Shown:
  - Document Title
  - Priority
  - Status
  - Key Stakeholders
  - Budget Estimate
```

---

## ⚡ **Advanced View Features**

### **🔍 Search & Filter Tips**

- Use **multiple filters** with AND/OR logic
- Create **saved searches** for complex queries
- Use **relative dates** ("next 7 days", "last week")
- **Combine text filters** with property filters

### **📊 Sorting Best Practices**

- **Primary sort**: Usually Priority or Due Date
- **Secondary sort**: Category or Status
- **Tertiary sort**: Last Updated for freshness

### **🎨 Visual Customization**

- **Color coding**: Use priority levels for visual impact
- **Icons**: Add emojis to view names for quick recognition
- **Grouping**: Group by Status for Kanban boards
- **Properties**: Show only relevant columns per view

---

## 🚀 **Quick Setup Checklist**

### **Essential Views to Create First:**

- [ ]  🔴 Critical Priority Dashboard
- [ ]  📅 This Week's Focus
- [ ]  🔄 Active Work Queue
- [ ]  👨‍💼 Board Meeting Prep
- [ ]  💰 Investor Relations
- [ ]  ⚖️ Legal Team Dashboard

### **Advanced Views to Add Later:**

- [ ]  📊 CEO Dashboard
- [ ]  🎯 Sprint Planning
- [ ]  📆 Monthly Roadmap
- [ ]  💸 High Investment Items
- [ ]  ✅ Completed Archive
- [ ]  🆓 Quick Wins

---

## 🔧 **Maintenance & Updates**

### **Weekly View Maintenance:**

1. **Review filters**: Ensure they capture current needs
2. **Update properties**: Add/remove columns as needed
3. **Check sorting**: Verify items appear in logical order
4. **Test performance**: Ensure views load quickly

### **Monthly View Optimization:**

1. **Analyze usage**: Which views are used most?
2. **Gather feedback**: What do team members need?
3. **Refine filters**: Make views more targeted
4. **Add new views**: Create views for new workflows

---

*Copy these configurations into your database for instant improved functionality*

*Next step: Test each view and customize based on your specific workflow needs*