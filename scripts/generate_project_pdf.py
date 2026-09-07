from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import (
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


OUTPUT = Path(r"C:\Users\Sachin\OneDrive\Desktop\final pbl webdev updated.pdf")


def build_pdf() -> None:
    styles = getSampleStyleSheet()
    styles.add(
        ParagraphStyle(
            name="TitleCenter",
            parent=styles["Title"],
            alignment=TA_CENTER,
            textColor=colors.HexColor("#0f172a"),
            fontSize=22,
            leading=28,
            spaceAfter=12,
        )
    )
    styles.add(
        ParagraphStyle(
            name="SectionHeading",
            parent=styles["Heading2"],
            textColor=colors.HexColor("#0f766e"),
            fontSize=14,
            leading=18,
            spaceBefore=10,
            spaceAfter=8,
        )
    )
    styles.add(
        ParagraphStyle(
            name="BodySmall",
            parent=styles["BodyText"],
            fontSize=10.5,
            leading=15,
            spaceAfter=6,
        )
    )

    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        rightMargin=1.5 * cm,
        leftMargin=1.5 * cm,
        topMargin=1.5 * cm,
        bottomMargin=1.5 * cm,
    )

    story = []
    story.append(Paragraph("B.Tech CSE Project Report", styles["TitleCenter"]))
    story.append(Paragraph("StockIt: Stock Analyzer and Screener", styles["TitleCenter"]))
    story.append(Spacer(1, 0.2 * cm))

    info_table = Table(
        [
            ["Team Name", "Sunrise"],
            ["Project Domain", "Full-Stack FinTech / Stock Market Analytics"],
            ["Market Focus", "Indian Stock Market (NSE Symbols)"],
            ["Frontend Stack", "React, Vite, Tailwind CSS, Framer Motion, lightweight-charts"],
            ["Backend Stack", "FastAPI, SQLAlchemy, SQLite, yfinance, scikit-learn, WebSockets"],
            ["Current Frontend URL", "http://127.0.0.1:5173"],
            ["Current Backend URL", "http://127.0.0.1:8000/api/health"],
            ["Demo Login Email", "demo@stockit.app"],
            ["Demo Login Password", "stockit123"],
        ],
        colWidths=[5.3 * cm, 10.7 * cm],
    )
    info_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.whitesmoke),
                ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#ecfeff")),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#94a3b8")),
                ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
                ("FONTSIZE", (0, 0), (-1, -1), 10),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    story.append(info_table)
    story.append(Spacer(1, 0.35 * cm))

    sections = [
        (
            "1. Project Abstract",
            "StockIt is a full-stack stock analysis and screening platform developed to help users analyze stocks, monitor live market movement, and manage personal investment activity through one modern web interface. The application focuses on the Indian stock market and provides real-time price updates, technical indicators, AI-based prediction, watchlist management, portfolio tracking, and user authentication.",
        ),
        (
            "2. Updated Project Approach and Architecture",
            "The project follows a modular full-stack architecture with a React frontend and FastAPI backend. The frontend handles routing, UI rendering, animation, charting, and API/WebSocket communication. The backend handles stock data retrieval, indicator computation, price prediction, authentication, persistence, and live price streaming. The codebase is organized into reusable modules for components, pages, hooks, services, context, models, schemas, routes, and database utilities.",
        ),
        (
            "3. Tasks Completed",
            "Completed work includes frontend dashboard creation, backend API setup, stock data integration, candlestick chart support, SMA and RSI implementation, linear regression prediction, login/register flow, protected routes, portfolio and watchlist management, Indian-market adaptation, live WebSocket pricing, animation enhancements, and local runtime verification.",
        ),
        (
            "4. Challenges / Roadblocks",
            "Key challenges included SQLite disk I/O issues in a OneDrive-synced workspace, stale backend processes on the same port, dependency/runtime mismatches, and redesigning the original demo-only setup into an actual authentication flow. These were solved by relocating the runtime database, restarting and validating live processes carefully, and restructuring auth and data access.",
        ),
        (
            "5. Tasks Pending",
            "Pending work includes JWT-based authentication, stronger password hashing such as bcrypt, edit/delete actions for portfolio and watchlist items, a broader screener for Indian stocks, more advanced prediction models, automated testing, and deployment hardening.",
        ),
        (
            "6. Project Outcome / Deliverables",
            "The project currently delivers a working frontend interface, a working backend API server, authentication, Indian-market stock search and detail support, live WebSocket stock updates, technical indicators, candlestick charting, watchlist and portfolio management, AI-based price prediction, and premium animated UI styling.",
        ),
        (
            "7. Progress Overview",
            "The project has reached a strong functional milestone. Core features are implemented and working locally, including authentication, Indian stock data, charting, live updates, and portfolio tracking. Remaining work is mainly related to production security, testing, and advanced enhancements.",
        ),
        (
            "8. Codebase Information",
            "The frontend is located under frontend/src with components, pages, hooks, services, context, and utils. The backend is located under backend/app with api, core, db, models, schemas, and services. Main entry points are frontend/src/main.jsx and backend/app/main.py.",
        ),
        (
            "9. Testing and Validation Status",
            "Validated successfully: frontend server startup, backend server startup, health route, login route, Indian stock detail route, portfolio and watchlist routes, WebSocket feed, and frontend production build. Full automated unit, integration, and end-to-end testing are still pending.",
        ),
        (
            "10. Deliverables Progress",
            "Completed: full-stack architecture, frontend dashboard UI, backend stock APIs, stock detail page, live price integration, candlestick chart integration, technical indicators, AI prediction, authentication flow, portfolio and watchlist features, Indian market adaptation, and motion/animation polish. Pending: production security hardening, advanced ML enhancement, and full automated testing.",
        ),
    ]

    for heading, body in sections:
        story.append(Paragraph(heading, styles["SectionHeading"]))
        story.append(Paragraph(body, styles["BodySmall"]))

    story.append(Paragraph("Student / Team Information", styles["SectionHeading"]))
    team_table = Table(
        [
            ["Team Member", "University Roll No.", "Student ID", "Email"],
            ["Sachin Pandey", "2319463", "23011188", "sachinpandey4224@gmail.com"],
            ["Ravindra Singh", "2319390", "230111208", "rc0422754@gmail.com"],
            ["Risabh", "2319398", "230111174", "Gehu.risabhk2@gmail.com"],
            ["Abhisek", "2318165", "230111805", "unknownkaintura9756@gmail.com"],
        ],
        colWidths=[4.2 * cm, 3.2 * cm, 3.2 * cm, 5.5 * cm],
    )
    team_table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#ccfbf1")),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#94a3b8")),
                ("FONTSIZE", (0, 0), (-1, -1), 9.5),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    story.append(team_table)
    story.append(PageBreak())

    story.append(Paragraph("Technical Summary", styles["SectionHeading"]))
    for line in [
        "Frontend Pages: Login, Register, Dashboard, Portfolio, Watchlist, Stock Detail",
        "Main Indicators: SMA 20, RSI 14",
        "Prediction Model: Linear Regression",
        "Realtime Protocol: WebSockets",
        "Data Source: Yahoo Finance via yfinance",
        "Primary Database: SQLite",
        "Primary Auth Demo Credentials: demo@stockit.app / stockit123",
    ]:
        story.append(Paragraph(f"• {line}", styles["BodySmall"]))

    story.append(Paragraph("Current Local Access", styles["SectionHeading"]))
    access_table = Table(
        [
            ["Frontend", "http://127.0.0.1:5173"],
            ["Backend Health", "http://127.0.0.1:8000/api/health"],
            ["Demo Email", "demo@stockit.app"],
            ["Demo Password", "stockit123"],
        ],
        colWidths=[5.3 * cm, 10.7 * cm],
    )
    access_table.setStyle(
        TableStyle(
            [
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#94a3b8")),
                ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#f0fdfa")),
                ("FONTSIZE", (0, 0), (-1, -1), 10),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]
        )
    )
    story.append(access_table)

    doc.build(story)


if __name__ == "__main__":
    build_pdf()
    print(OUTPUT)
