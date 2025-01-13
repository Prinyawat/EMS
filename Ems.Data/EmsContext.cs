using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using System.IdentityModel.Tokens.Jwt;
using System.Reflection;
using System.Security.Claims;

namespace Ems.Data.Entities
{
    public partial class EmsContext : DbContext
    {
        private IDbContextTransaction _currentTransaction;
        private readonly IHttpContextAccessor httpContext;
        string CurrentUser;
        public EmsContext(DbContextOptions<EmsContext> options, IHttpContextAccessor _http)
        : base(options)
        {
            if (_http.HttpContext != null)
            {
                string beaer = _http.HttpContext.Request.Headers["Authorization"].ToString();
                httpContext = _http;
                if (!string.IsNullOrWhiteSpace(beaer))
                {
                    string token = beaer.Split(' ')[1];
                    var handler = new JwtSecurityTokenHandler();
                    JwtSecurityToken Jwt = handler.ReadJwtToken(token);
                    CurrentUser = Jwt.Claims.Where(claim => claim.Type == ClaimTypes.Name).Select(x => x.Value).FirstOrDefault();
                }
                else
                {
                    CurrentUser = "Unknow";
                }
            }
            else
            {
                CurrentUser = "Unknow";
            }

        }


        private void AutoFilBaseProp(bool ignoreGenerateGuid)
        {
            var entries = ChangeTracker.Entries().Where(e => e.State == EntityState.Added || e.State == EntityState.Modified);

            foreach (var entityEntry in entries)
            {
                PropertyInfo updated_by = entityEntry.Entity.GetType().GetProperty("updated_by");
                PropertyInfo updated_date = entityEntry.Entity.GetType().GetProperty("updated_date");

                if (updated_by == null)
                    updated_by = entityEntry.Entity.GetType().GetProperty("updatedby");
                if (updated_date == null)
                    updated_date = entityEntry.Entity.GetType().GetProperty("updateddate");


                if (updated_by != null)
                {
                    if (string.IsNullOrWhiteSpace(CurrentUser))
                    {
                        updated_by.SetValue(entityEntry.Entity, "not found");
                    }
                    else
                    {
                        updated_by.SetValue(entityEntry.Entity, CurrentUser);
                    }

                }
                if (updated_date != null) updated_date.SetValue(entityEntry.Entity, DateTime.Now);


                if (entityEntry.State == EntityState.Added)
                {
                    PropertyInfo id = entityEntry.Entity.GetType().GetProperty("id");
                    PropertyInfo created_by = entityEntry.Entity.GetType().GetProperty("created_by");
                    PropertyInfo created_date = entityEntry.Entity.GetType().GetProperty("created_date");

                    if (created_by == null)
                        created_by = entityEntry.Entity.GetType().GetProperty("createdby");
                    if (created_date == null)
                        created_date = entityEntry.Entity.GetType().GetProperty("createddate");


                    if (created_by != null)
                    {
                        if (string.IsNullOrWhiteSpace(CurrentUser))
                        {
                            created_by.SetValue(entityEntry.Entity, "not found");
                        }
                        else
                        {
                            created_by.SetValue(entityEntry.Entity, CurrentUser);
                        }
                    }

                    if (created_date != null) created_date.SetValue(entityEntry.Entity, DateTime.Now);
                }
            }
        }

        public override int SaveChanges()
        {
            AutoFilBaseProp(false);
            return base.SaveChanges();
        }

        //THAY
        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            AutoFilBaseProp(false);
            return await base.SaveChangesAsync();
        }


        public async Task<IDbContextTransaction> BeginTransactionAsync()
        {
            if (_currentTransaction != null) return null;

            _currentTransaction = await Database.BeginTransactionAsync(System.Data.IsolationLevel.ReadCommitted);

            return _currentTransaction;
        }
        public async Task CommitTransactionAsync(IDbContextTransaction transaction, CancellationToken cancellationToken)
        {
            if (transaction == null) throw new ArgumentNullException(nameof(transaction));
            if (transaction != _currentTransaction) throw new InvalidOperationException($"Transaction {transaction.TransactionId} is not current");

            try
            {
                await SaveChangesAsync(cancellationToken);
                transaction.Commit();
            }
            catch
            {
                RollbackTransaction();
                throw;
            }
            finally
            {
                if (_currentTransaction != null)
                {
                    _currentTransaction.Dispose();
                    _currentTransaction = null;
                }
            }
        }
        public void RollbackTransaction()
        {
            try
            {
                _currentTransaction?.Rollback();
            }
            finally
            {
                if (_currentTransaction != null)
                {
                    _currentTransaction.Dispose();
                    _currentTransaction = null;
                }
            }
        }
    }
}
