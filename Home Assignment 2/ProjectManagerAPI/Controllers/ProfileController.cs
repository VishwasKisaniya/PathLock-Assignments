using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProjectManagerAPI.DTOs;
using ProjectManagerAPI.Services;
using System.Security.Claims;

namespace ProjectManagerAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController : ControllerBase
    {
        private readonly IProfileService _profileService;

        public ProfileController(IProfileService profileService)
        {
            _profileService = profileService;
        }

        private int GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.Parse(userIdClaim!);
        }

        // GET: api/profile
        [HttpGet]
        public async Task<ActionResult<ProfileDto>> GetProfile()
        {
            var userId = GetUserId();
            var profile = await _profileService.GetProfileAsync(userId);
            
            if (profile == null)
                return NotFound(new { message = "Profile not found" });

            return Ok(profile);
        }

        // PUT: api/profile
        [HttpPut]
        public async Task<ActionResult<ProfileDto>> UpdateProfile([FromBody] UpdateProfileDto updateDto)
        {
            var userId = GetUserId();
            var profile = await _profileService.UpdateProfileAsync(userId, updateDto);
            
            if (profile == null)
                return NotFound(new { message = "Profile not found" });

            return Ok(profile);
        }
    }
}
