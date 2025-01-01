using Microsoft.EntityFrameworkCore;
using MindMapper.Data;
using MindMapper.Data.Models;
using MindMapper.Data.Roles;
using MindMapper.Server.DtoModels.CardDto;
using MindMapper.Server.DtoModels.CompositeCanvasStateDto;
using MindMapper.Server.DtoModels.OptionDto;
using MindMapper.Server.Services.Repository.Implementation;
using System.Data;
using System.Linq;

namespace MindMapper.Server.Services.Composite
{
    public class CanvasStateComposite : ICanvasStateComposite
    {
        private MindMapperContext _db;

        public CanvasStateComposite(MindMapperContext db) 
        {
            _db = db;
        }

        public async Task<CompositeCanvasStateDtoResponse> Add(CompositeCanvasStateDtoRequest addDto, string userId, HashSet<ApplicationUserRole> roles)
        {
            return await AddOrUpdate(addDto, userId, roles); 
        }

        public async Task<CompositeCanvasStateDtoResponse?> GetById(string entityId, string userId, HashSet<ApplicationUserRole> roles)
        {
            // Repos
            var canvasRepo = new CanvasStateRepository(_db);
            var cardRepo = new CardRepository(_db);
            var optionRepo = new OptionRepository(_db);

            // Get Canvas by Id
            var dbCanvas = canvasRepo.Get(userId, roles).FirstOrDefault(canvas => canvas.Id.ToString() == entityId);

            // Return if no result
            if (dbCanvas == null)
            {
                return null;
            }

            // Get associated cards to the canvas
            var dbCards = cardRepo.Get(userId, roles).Where(card => card.CanvasStateId == dbCanvas.Id);

            // Select the card Ids (we need for Options)
            var dbCardIds = dbCards.Select(card => card.Id);
            // Get associated Options with the card Ids
            var dbOptions = optionRepo.Get(userId, roles).Where(option => dbCardIds.Contains(option.CardId));

            // Return final output
            return new CompositeCanvasStateDtoResponse
            {
                Canvas = new DtoModels.CanvasStateDto.CanvasStateDto().ToResponse(dbCanvas),
                Cards = dbCards.Select(card => new CardDto().ToResponse(card)),
                Options = dbOptions.Select(option => new OptionDto().ToResponse(option))
            };
        }

        public async Task<CompositeCanvasStateDtoResponse> Update(CompositeCanvasStateDtoRequest updateDto, string userId, HashSet<ApplicationUserRole> roles)
        {
            return await AddOrUpdate(updateDto, userId, roles); 
        }

        private async Task<CompositeCanvasStateDtoResponse> AddOrUpdate(CompositeCanvasStateDtoRequest updateDto, string userId, HashSet<ApplicationUserRole> roles)
        {
            var output = new CompositeCanvasStateDtoResponse();

            using (var transaction = _db.Database.BeginTransaction())
            {
                try
                {
                    // Repos
                    var canvasRepo = new CanvasStateRepository(_db);
                    var optionRepo = new OptionRepository(_db);
                    var cardRepo = new CardRepository(_db);

                    /*
                     * Canvas
                     */
                    // Update db
                    var dbCanvas = updateDto.Canvas.ToDbModel(userId);

                    // Add or Update
                    if (dbCanvas.Id == new Guid())
                    {
                        dbCanvas = await canvasRepo.Add(dbCanvas, userId, roles);
                    }
                    else
                    {
                        dbCanvas = await canvasRepo.Update(dbCanvas, userId, roles);
                    }

                    /*
                     * Cards
                     */
                    // Map naive Ids to real Ids (Guids)
                    var cardIdMap = new Dictionary<int, Guid>();
                    // Prepare final output
                    var outputCards = new Queue<CardDto>();

                    // Preexisting cards (remove unreferenced ones later)
                    var preExistingCardIds = cardRepo.Get(userId, roles).Where(card => card.CanvasStateId == dbCanvas.Id).Select(card => card.Id).ToArray();
                    // Referenced cards
                    var referencedCards = new Queue<Card>();

                    foreach (var card in updateDto.Cards)
                    {
                        // Prepare the db model
                        var dbCard = card.ToDbModel(userId, dbCanvas.Id);
                        dbCard.CanvasStateId = dbCanvas.Id;

                        // Add or Update db
                        if (dbCard.Id == new Guid())
                        {
                            dbCard = await cardRepo.Add(dbCard, userId, roles);
                        }
                        else
                        {
                            dbCard = await cardRepo.Update(dbCard, userId, roles);
                        }

                        // Collect the referenced db cards
                        referencedCards.Enqueue(dbCard);

                        // Populate the mapping to real Guid Id
                        cardIdMap.Add(card.NaiveId, dbCard.Id);
                        // Prepare final output
                        outputCards.Enqueue(new CardDto().ToResponse(dbCard));
                    }

                    // Remove cards that are preexisting and unreferenced 
                    var removeCardIds = preExistingCardIds.Except(referencedCards.Select(referenced => referenced.Id));

                    // Remove from db
                    foreach (var removeCardId in removeCardIds)
                    {
                        var orphanedCard = await cardRepo.Get(userId, roles).FirstOrDefaultAsync(card => card.Id == removeCardId); 
                        await cardRepo.Remove(orphanedCard, userId, roles);
                    }

                    /*
                     * Canvas Seed Card
                     * CONVENTION - Use the first card in the list
                     */
                    if (referencedCards.Count != 0)
                    { 
                        dbCanvas.SeedCardId = referencedCards.Peek().Id;
                        dbCanvas = await canvasRepo.Update(dbCanvas, userId, roles);
                    }

                    // Prepare final output
                    output.Canvas = new DtoModels.CanvasStateDto.CanvasStateDto().ToResponse(dbCanvas);

                    /*
                     * Options
                     */
                    // Prepare final output
                    var outputOptions = new Queue<OptionDto>();

                    // Get all preexisting Options from referenced cards
                    var referencedCardIds = referencedCards.Select(card => card.Id);
                    var preExistingOptionIds = optionRepo.Get(userId, roles).Where(option => referencedCardIds.Contains(option.CardId)).Select(option => option.Id).ToArray();

                    // Referenced Options
                    var referencedOptions = new HashSet<Option>();

                    foreach (var option in updateDto.Options)
                    {
                        // Prepare db model
                        var dbOption = option.ToDbModel(userId, cardIdMap[option.NaiveCardId]);
                        dbOption.PointToCardId = option.NaivePointToCardId == null ? null : cardIdMap[(int)option.NaivePointToCardId];

                        // Add or Update db
                        if (dbOption.Id == new Guid())
                        {
                            dbOption = await optionRepo.Add(dbOption, userId, roles);
                        }
                        else
                        {
                            dbOption = await optionRepo.Update(dbOption, userId, roles);
                        }

                        // Collect referenced Options
                        referencedOptions.Add(dbOption);

                        // Prepare final output
                        outputOptions.Enqueue(new OptionDto().ToResponse(dbOption));
                    }

                    // Remove Options that are preexisting and unreferenced
                    var removeOptionIds = preExistingOptionIds.Except(referencedOptions.Select(referenced => referenced.Id));

                    // Remove from db
                    foreach (var removeOptionId in removeOptionIds)
                    {
                        var orphanedOption = await optionRepo.Get(userId, roles).FirstOrDefaultAsync(option => option.Id == removeOptionId);    
                        await optionRepo.Remove(orphanedOption, userId, roles);
                    }

                    // finally - get the Output ready
                    output.Cards = outputCards;
                    output.Options = outputOptions;

                    // Commit, we are good
                    transaction.Commit();
                }
                catch (Exception ex)
                {
                    // TODO: Add multiple catch statements for different exception types. A multitude of things could have gone wrong.
                    transaction.Rollback();
                    throw new Exception("Composite Exception");
                }
            }

            return output;
        }
    }
}
