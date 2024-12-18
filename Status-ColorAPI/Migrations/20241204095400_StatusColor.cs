using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Status_ColorAPI.Migrations
{
    /// <inheritdoc />
    public partial class StatusColor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "StatusColors",
                columns: table => new
                {
                    StatusId = table.Column<long>(type: "bigserial", nullable: false),
                    StatusType = table.Column<string>(type: "varchar(50)", nullable: true),
                    StatusCode = table.Column<string>(type: "varchar(50)", nullable: true),
                    StatusName = table.Column<string>(type: "varchar(50)", nullable: true),
                    Active = table.Column<bool>(type: "bool", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StatusColors", x => x.StatusId);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StatusColors");
        }
    }
}
