using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Status_ColorAPI.Entities;

namespace Status_ColorAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StatusColorController : ControllerBase
    {
        private readonly EmsContext _context;

        public StatusColorController(EmsContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<StatusColor>>> GetStatusColors(
         string activeStatus = "",
         string statusType = "",
         string searchText = "")
        {
            if (_context.StatusColors == null)
            {
                return NotFound();
            }

            var statusList = await _context.StatusColors.ToListAsync();

            // Filter Active-Inactive
            if (!string.IsNullOrEmpty(activeStatus))
            {
                bool isActive = activeStatus == "1";
                statusList = statusList.Where(x => x.Active == isActive).ToList();
            }

            // Filter Status Type
            if (!string.IsNullOrEmpty(statusType))
            {
                statusList = statusList.Where(x => x.StatusType == statusType).ToList();
            }

            // Filter Search Text
            if (!string.IsNullOrEmpty(searchText))
            {
                statusList = statusList.Where(x => x.StatusName.Contains(searchText, StringComparison.OrdinalIgnoreCase)).ToList();
            }

            return statusList;
        }

        // GET: api/StatusColor/5
        [HttpGet("{id}")]
        public async Task<ActionResult<StatusColor>> GetStatusColor(long id)
        {
            var statusColor = await _context.StatusColors.FindAsync(id);

            if (statusColor == null)
            {
                return NotFound();
            }

            return statusColor;
        }

        // PUT: api/StatusColor/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStatusColor(long id, StatusColor statusColor)
        {
            if (id != statusColor.StatusId)
            {
                return BadRequest();
            }

            _context.Entry(statusColor).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!StatusColorExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(await _context.StatusColors.ToListAsync());
        }

        // POST: api/StatusColor
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<StatusColor>> PostStatusColor(StatusColor statusColor)
        {
            _context.StatusColors.Add(statusColor);
            await _context.SaveChangesAsync();

            return Ok(await _context.StatusColors.ToListAsync());
        }

        // DELETE: api/StatusColor/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStatusColor(long id)
        {
            var statusColor = await _context.StatusColors.FindAsync(id);
            if (statusColor == null)
            {
                return NotFound();
            }

            _context.StatusColors.Remove(statusColor);
            await _context.SaveChangesAsync();

            return Ok(await _context.StatusColors.ToListAsync());
        }

        private bool StatusColorExists(long id)
        {
            return _context.StatusColors.Any(e => e.StatusId == id);
        }
    }
}
