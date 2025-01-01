using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MindMapper.Data.Migrations
{
    /// <inheritdoc />
    public partial class Card_CanvasId_NotNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cards_Canvases_CanvasStateId",
                table: "Cards");

            migrationBuilder.AlterColumn<Guid>(
                name: "CanvasStateId",
                table: "Cards",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Cards_Canvases_CanvasStateId",
                table: "Cards",
                column: "CanvasStateId",
                principalTable: "Canvases",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cards_Canvases_CanvasStateId",
                table: "Cards");

            migrationBuilder.AlterColumn<Guid>(
                name: "CanvasStateId",
                table: "Cards",
                type: "uniqueidentifier",
                nullable: true,
                oldClrType: typeof(Guid),
                oldType: "uniqueidentifier");

            migrationBuilder.AddForeignKey(
                name: "FK_Cards_Canvases_CanvasStateId",
                table: "Cards",
                column: "CanvasStateId",
                principalTable: "Canvases",
                principalColumn: "Id");
        }
    }
}
