﻿using MindMapper.Data.Models;
using MindMapper.Server.Services.Repository.Base;

namespace MindMapper.Server.Services.Repository.Interface
{
    public interface ICardRepository : IDbRepository<Card>
    {
    }
}